figma.showUI(__html__, { width: 480, height: 420, title: "Theme Studio Importer" });

figma.ui.onmessage = function (msg) {
  if (msg.type !== "import") return;

  try {
    var data = JSON.parse(msg.json);

    if (!data.collections || !Array.isArray(data.collections)) {
      throw new Error('Invalid format: expected a "collections" array at root.');
    }

    var results = [];

    for (var c = 0; c < data.collections.length; c++) {
      var col = data.collections[c];

      if (!col.name || !Array.isArray(col.modes) || !Array.isArray(col.variables)) {
        throw new Error('Collection "' + (col.name || "?") + '" is missing name, modes, or variables.');
      }

      // Create collection — Figma always starts with one default mode
      var collection = figma.variables.createVariableCollection(col.name);

      // Map mode name → modeId
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

          var modeNames = Object.keys(def.valuesByMode);
          for (var k = 0; k < modeNames.length; k++) {
            var modeName = modeNames[k];
            var modeId = modeIds[modeName];
            if (modeId === undefined) continue;

            var value = def.valuesByMode[modeName];

            // Coerce numeric strings to float for FLOAT variables.
            // If the string can't be parsed (e.g. calc() expressions), skip this mode value.
            if (def.type === "FLOAT" && typeof value === "string") {
              var parsed = parseFloat(value);
              if (isNaN(parsed)) continue;
              value = parsed;
            }

            variable.setValueForMode(modeId, value);
          }

          created++;
        } catch (varErr) {
          // One bad variable must not stop the rest
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
