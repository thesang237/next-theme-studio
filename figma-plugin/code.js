figma.showUI(__html__, { width: 480, height: 420, title: "Theme Studio Importer" });

figma.ui.onmessage = function (msg) {
  if (msg.type !== "import") return;

  try {
    var data = JSON.parse(msg.json);

    if (!data.collections || !Array.isArray(data.collections)) {
      throw new Error('Invalid format: expected a "collections" array at root.');
    }

    // Registry: "CollectionName/variableName" → Variable object
    // Built as we create variables so later collections can alias earlier ones.
    var variableRegistry = {};

    function isAlias(value) {
      return value !== null &&
        typeof value === "object" &&
        typeof value.collection === "string" &&
        typeof value.name === "string" &&
        !("r" in value);
    }

    var results = [];

    for (var c = 0; c < data.collections.length; c++) {
      var col = data.collections[c];

      if (!col.name || !Array.isArray(col.modes) || !Array.isArray(col.variables)) {
        throw new Error('Collection "' + (col.name || "?") + '" is missing name, modes, or variables.');
      }

      var collection = figma.variables.createVariableCollection(col.name);

      var modeIds = {};
      collection.renameMode(collection.modes[0].modeId, col.modes[0]);
      modeIds[col.modes[0]] = collection.modes[0].modeId;

      for (var m = 1; m < col.modes.length; m++) {
        modeIds[col.modes[m]] = collection.addMode(col.modes[m]);
      }

      var created = 0;
      var skipped = 0;

      for (var v = 0; v < col.variables.length; v++) {
        var def = col.variables[v];

        if (!def.name || !def.type || !def.valuesByMode) {
          skipped++;
          continue;
        }

        try {
          var variable = figma.variables.createVariable(def.name, collection.id, def.type);

          if (def.description) {
            variable.description = def.description;
          }

          // Register so later collections can alias this variable
          variableRegistry[col.name + "/" + def.name] = variable;

          var modeNames = Object.keys(def.valuesByMode);
          for (var k = 0; k < modeNames.length; k++) {
            var modeName = modeNames[k];
            var modeId = modeIds[modeName];
            if (modeId === undefined) continue;

            var value = def.valuesByMode[modeName];

            // Resolve alias: { collection, name } → VariableAlias
            if (isAlias(value)) {
              var registryKey = value.collection + "/" + value.name;
              var targetVar = variableRegistry[registryKey];
              if (!targetVar) {
                // Target not created yet or doesn't exist — skip this mode value
                continue;
              }
              value = figma.variables.createVariableAlias(targetVar);
            }

            // Coerce numeric strings to float for FLOAT variables
            if (def.type === "FLOAT" && typeof value === "string") {
              var parsed = parseFloat(value);
              if (isNaN(parsed)) continue;
              value = parsed;
            }

            variable.setValueForMode(modeId, value);
          }

          created++;
        } catch (varErr) {
          skipped++;
        }
      }

      results.push(
        col.name + ": " + created + " variable" + (created !== 1 ? "s" : "") + " imported" +
        (skipped ? ", " + skipped + " skipped" : "")
      );
    }

    figma.ui.postMessage({ type: "success", results: results });
  } catch (err) {
    figma.ui.postMessage({ type: "error", message: err.message });
  }
};
