var StaticSaver = function(config) {
    Ext.onReady(function(){

        var nameInput = Ext.get(config.nameInput);
        var staticFile = Ext.getCmp(config.staticFile);
        var sourceInput = Ext.getCmp(config.sourceInput);
        var isStatic = Ext.getCmp(config.isStatic);
        var categoryInput = Ext.getCmp(config.categoryInput);

        if (!(nameInput && staticFile && sourceInput)) {
            return;
        }

        if (MODx.config['staticsaver.static_default'] == 1) {
            isStatic.setValue(true);
        }

        var setValue = function(placeholder, value) {
            var new_value = '';
            if (MODx.config['staticsaver.static_file_extension'] !== '') {
                new_value = value + '.' + MODx.config['staticsaver.static_file_extension'];
            }
            else if (MODx.config[config.fileExt] !== '') {
                new_value = value + '.' + MODx.config[config.fileExt];
            }

            if (MODx.config['staticsaver.include_category']) {
                var category = categoryInput.getRawValue();
                if (category != categoryInput.getValue()) {
                    new_value =  category + '/' + new_value;
                }
            }

            Ext.Ajax.request({
                url:  MODx.config['assets_url'] + 'components/staticsaver/connector.php',
                success: function(e){
                    if (e.responseText == '1') {
                        placeholder.setValue(new_value);
                    }
                },
                params: {
                    action: 'check',
                    type : config.type,
                    id: MODx.request.id,
                    source: sourceInput.getValue(),
                    static_file: placeholder.getValue()
                }
            });
        }
        
        setValue(staticFile, nameInput.getAttribute('value'));
        var sourceStore = sourceInput.getStore();  
        var sources = [];
        sourceStore.load({
            callback: function(r) {
                Ext.each(r, function(item, index) {
                    sources.push(item.data.id);
                    if (item.data.id == config.source) {
                        sourceInput.setValue(config.source);
                        return false;
                    }
                    return true;
                });
            }
        });
        nameInput.on('keyup', function() {
            setValue(staticFile, nameInput.getAttribute('value'));
        });
        categoryInput.on('change', function(){
            setValue(staticFile, nameInput.getAttribute('value'));
        });
    });
};