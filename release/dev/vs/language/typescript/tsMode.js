define(["require", "exports", "./workerManager", "./languageFeatures"], function (require, exports, workerManager_1, languageFeatures) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var scriptWorkerMap = {};
    function setupNamedLanguage(languageName, isTypescript, defaults) {
        scriptWorkerMap[languageName + "Worker"] = setupMode(defaults, languageName);
    }
    exports.setupNamedLanguage = setupNamedLanguage;
    function getNamedLanguageWorker(languageName) {
        var workerName = languageName + "Worker";
        return new Promise(function (resolve, reject) {
            if (!scriptWorkerMap[workerName]) {
                return reject(languageName + " not registered!");
            }
            resolve(scriptWorkerMap[workerName]);
        });
    }
    exports.getNamedLanguageWorker = getNamedLanguageWorker;
    function setupMode(defaults, modeId) {
        var client = new workerManager_1.WorkerManager(modeId, defaults);
        var worker = function () {
            var uris = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                uris[_i] = arguments[_i];
            }
            return client.getLanguageServiceWorker.apply(client, uris);
        };
        monaco.languages.registerCompletionItemProvider(modeId, new languageFeatures.SuggestAdapter(worker));
        monaco.languages.registerSignatureHelpProvider(modeId, new languageFeatures.SignatureHelpAdapter(worker));
        monaco.languages.registerHoverProvider(modeId, new languageFeatures.QuickInfoAdapter(worker));
        monaco.languages.registerDocumentHighlightProvider(modeId, new languageFeatures.OccurrencesAdapter(worker));
        monaco.languages.registerDefinitionProvider(modeId, new languageFeatures.DefinitionAdapter(worker));
        monaco.languages.registerReferenceProvider(modeId, new languageFeatures.ReferenceAdapter(worker));
        monaco.languages.registerDocumentSymbolProvider(modeId, new languageFeatures.OutlineAdapter(worker));
        monaco.languages.registerDocumentRangeFormattingEditProvider(modeId, new languageFeatures.FormatAdapter(worker));
        monaco.languages.registerOnTypeFormattingEditProvider(modeId, new languageFeatures.FormatOnTypeAdapter(worker));
        monaco.languages.registerCodeActionProvider(modeId, new languageFeatures.CodeActionAdaptor(worker));
        monaco.languages.registerRenameProvider(modeId, new languageFeatures.RenameAdapter(worker));
        new languageFeatures.DiagnosticsAdapter(defaults, modeId, worker);
        return worker;
    }
});
