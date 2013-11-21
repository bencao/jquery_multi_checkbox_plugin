jQuery.fn.extend({
    multiCheck : function(options) {
        var defaultOptions = {
            lineSelector     : 'li',
            checkboxSelector : 'input[type=checkbox]',
            highlightClass   : false,
            cursorClass      : false
        };
        
        for (var prop in defaultOptions) {
            if (options[prop] === undefined) {
                options[prop] = defaultOptions[prop];
            }
        }
        
        var outContainer = this.get(0);
        
        outContainer.getPrev = function() {
            return jQuery(this).data('multi_checkbox_p'); 
        };
        
        outContainer.setPrev = function(newValue) {
            jQuery(this).data('multi_checkbox_p', newValue);
        };
        
        outContainer.allChecked = function(start, end) {
            var checkboxes = jQuery(this).data('checkboxes');
            
            // the prev line should not be considered when judge allCheck
            if (end < start) {
                var temp = end;
                end = start;
                start = temp;
                end = end - 1;
            } else {
                start = start + 1;
            }
            for (var i = start; i <= end; i ++) {
                if (! checkboxes[i].checked){
                    return false;
                }
            }
            return true;
        };
        
        outContainer.checkAll = function(start, end, uncheck) {
            var checkboxes = jQuery(this).data('checkboxes');
            
            if (end < start) {
                var temp = end;
                end = start;
                start = temp;
            }
            for (var i = start; i <= end; i ++) {
                checkboxes[i].checked = ! uncheck;
                if (uncheck) {
                    checkboxes[i].container.unhighlight();
                } else {
                    checkboxes[i].container.highlight();
                }
            }
        };
        
        this.data('multi_checkbox_p', -1).data('checkboxes', [])
            .find(options.lineSelector).each(function(index) {
                
            this.highlight = function() {
                if (options.highlightClass) {
                    jQuery(this).addClass(options.highlightClass);
                }
            };
            this.unhighlight = function() {
                if (options.highlightClass) {
                    jQuery(this).removeClass(options.highlightClass);
                }
            };
            
            var checkbox = jQuery(this).find(options.checkboxSelector).get(0);
            
            checkbox.container = this;
            checkbox.cid = index;
            checkbox.toogle = function() {
                if (this.checked) {
                    this.container.highlight();
                } else {
                    this.container.unhighlight();
                }
            };
            checkbox.cursor = function() {
                if (options.cursorClass) {
                    jQuery(this).addClass(options.cursorClass);
                }
            };
            checkbox.uncursor = function() {
                if (options.cursorClass) {
                    jQuery(this).removeClass(options.cursorClass);
                }
            };
            
            jQuery(checkbox).click(function(event) {
                var cur = this.cid;
                var prev = outContainer.getPrev();
                
                if (event.shiftKey && prev != -1) {
                    this.checked = ! this.checked;
                    outContainer.checkAll(
                        prev,
                        cur,
                        outContainer.allChecked(prev, cur)
                    );
                } else {
                    this.toogle();
                }
                if (prev != -1) {
                    jQuery(outContainer).data('checkboxes')[prev].uncursor();
                }
                
                this.cursor();
                outContainer.setPrev(cur);
            });
            
            jQuery(outContainer).data('checkboxes')[index] = checkbox;
        });

    }
});
