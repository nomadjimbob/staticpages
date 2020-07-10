/**
 * Dokuwiki Static Pages Plugin
 *
 * @license    GPL 2 (http://www.gnu.org/licenses/gpl.html)
 * @author     James Collins <james.collins@outlook.com.au>
 * @link       https://github.com/nomadjimbon/staticpages
 */

jQuery(document).ready(function() {
    jQuery('.staticpages-button-selectall').on('click', function() {
        staticpages.selectAll();
    });

    jQuery('.staticpages-button-unselectall').on('click', function() {
        staticpages.unselectAll();
    });

    jQuery('.staticpages-button-invertselection').on('click', function() {
        staticpages.invertSelection();
    });

    jQuery('#staticpages-files input[type="checkbox"][name^="filesall"]').on('click', function() {
        if(jQuery(this).prop('checked')) {
            jQuery('input[type="checkbox"][name^="file["]').prop('checked', true);
        } else {
            jQuery('input[type="checkbox"][name^="file["]').prop('checked', false);
        }
    });

    jQuery('.staticpages-button-delete').on('click', function() {
        var selected = Array();

        jQuery('#staticpages-files input[type="checkbox"][name^="file["]').each(function(index, elem) {
            if(jQuery(elem).prop('checked')) {
                var matches = jQuery(elem).attr('name').match(/[^\0]*\[([^\0]*)\]/);
                if(matches !== null && matches.length > 1) {
                    selected.push(matches[1]);
                }
            }
        });

        if(selected.length > 0) {
            staticpages.status('Deleting files...');
            staticpages.ajaxData('rm', jQuery('.staticpages-path').attr('path'), {'files': selected}, function() {
                staticpages.viewDir(jQuery('.staticpages-path').attr('path'));
                staticpages.status();
            });
        }
    });

    jQuery('.staticpages-button-createfolder').on('click', function() {
        var name = prompt('Enter the folder name');

        if(name != null && name != '') {
            staticpages.status('Creating folder...');
            staticpages.ajaxData('mkdir', jQuery('.staticpages-path').attr('path'), {'name': name}, function() {
                staticpages.viewDir(jQuery('.staticpages-path').attr('path'));
                staticpages.status();
            });
        }
    });

    jQuery('.staticpages-button-upload').on('click', function() {
        jQuery('#staticpages-uploadfile').click();
    });

    jQuery('#staticpages-uploadfile').on('change', function() {
        staticpages.showUploads();

        ([...this.files]).forEach(file => {
            staticpages.addUpload((file.webkitRelativePath != '' ? file.webkitRelativePath : file.name));
            staticpages.ajaxData('upload', jQuery('.staticpages-path').attr('path'), {'file': file, 'webkitRelativePath': file.webkitRelativePath}, function() {
                staticpages.viewDir(jQuery('.staticpages-path').attr('path'));
                jQuery('#staticpages-uploadfile').val('');
            }, false, function(file, percent) {
                staticpages.updateUpload(file, percent);
            });
        });
    });

    jQuery('.staticpages-button-uploadclose').on('click', function() {
        staticpages.hideUploads();
    });

    jQuery('.staticpages-button-clearerrors').on('click', function() {
        staticpages.clearErrors();
    });

    jQuery('#staticpages-files').on('click', '.staticpages-button-copycode', function(e) {
        e.preventDefault();
        staticpages.copyToClipboard('{{staticpages>' + jQuery(this).attr('path') + '}}');
        alert('Link copied to clipboard');
    });



    jQuery('#staticpages-files').on('click', 'input[type="checkbox"][name^="file["]', function() {
        if(jQuery(this).prop('checked') == false) {
            jQuery('#staticpages-files input[type="checkbox"][name^="filesall"]').prop('checked', false);
        } else {
            var allChecked = true;
            
            jQuery('#staticpages-files input[type="checkbox"][name^="file["]').each(function(index, elem) {
                if(!jQuery(elem).prop('checked')) {
                    allChecked = false;
                }
            });

            if(allChecked) {
                jQuery('#staticpages-files input[type="checkbox"][name^="filesall"]').prop('checked', true);
            }
        }
    });

    jQuery('#staticpages').on('click', '.folder', function() {
        console.log('click');
        staticpages.viewDir(jQuery(this).attr('path'));
    });

    staticpages.viewDir('/');
});

var staticpages = {
    status: function(s='', p='') {
        if(s != null) jQuery('.staticpages-status .text').html(s);
        if(p != null) jQuery('.staticpages-status .progress').html(p);
    },

    showUploads: function() {
        jQuery('.staticpages-tools').hide();
        jQuery('.staticpages-path').hide();
        jQuery('#staticpages-files').hide();
        jQuery('#staticuploads tbody').empty();
        jQuery('#staticuploads .staticpages-button').hide();
        jQuery('#staticuploads').show();
    },

    hideUploads: function() {
        jQuery('#staticuploads').hide();
        jQuery('.staticpages-tools').show();
        jQuery('.staticpages-path').show();
        jQuery('#staticpages-files').show();
    },

    addUpload: function(name) {
        jQuery('<tr file="' + name + '"><td>' + name + '</td><td percent="0" >Processing....</td></tr>').appendTo('#staticuploads tbody');
    },

    updateUpload: function(name, percent) {
        jQuery('#staticuploads tbody tr[file="' + name + '"] td + td').attr('percent', percent).html(percent + '%');

        jQuery('#staticuploads tbody tr td + td').each(function() {
            if(jQuery(this).attr('percent') == '100') {
                jQuery(this).parent().remove();
            }
        });

        if(jQuery('#staticuploads tbody tr').length == 0) {
            staticpages.hideUploads();
        }
    },

    addError: function(s) {
        jQuery('<li>' + s + '</li>').appendTo('#staticpages-errors ul');
        jQuery('.staticpages-button-clearerrors').show();
    },

    clearErrors: function() {
        jQuery('#staticpages-errors ul').empty();
        jQuery('.staticpages-button-clearerrors').hide();
    },

    selectAll: function() {
        jQuery('#staticpages-files input[type="checkbox"]').prop('checked', true);
    },

    unselectAll: function() {
        jQuery('#staticpages-files input[type="checkbox"]').prop('checked', false);
    },

    invertSelection: function() {
        jQuery('#staticpages-files input[type="checkbox"][name^="file["]').each(function(index, elem) {
            jQuery(elem).prop('checked', !jQuery(elem).prop('checked'));
        });

        var allChecked = true;
            
        jQuery('#staticpages-files input[type="checkbox"][name^="file["]').each(function(index, elem) {
            if(!jQuery(elem).prop('checked')) {
                allChecked = false;
            }
        });

        if(allChecked) {
            jQuery('#staticpages-files input[type="checkbox"][name^="filesall"]').prop('checked', true);
        } else {
            jQuery('#staticpages-files input[type="checkbox"][name^="filesall"]').prop('checked', false);
        }        
    },

    sortColumn: function(col, asc=true) {
        var table = jQuery('#staticpages-files tbody');
        var rows = table.find('tr');

        table.empty();
        rows.each(function() {
            var compareRow = jQuery(this);
            var compareValue = compareRow.find('[name="' + col + '"]').attr('data');
            var searchRows = table.find('tr');
            var insertAfter = null;

            searchRows.each(function() {
                rowValue = jQuery(this).find('[name="' + col + '"]').attr('data');

                if(parseFloat(rowValue) == rowValue && parseFloat(compareValue) == compareValue) {
                    rowValue = parseFloat(rowValue);
                    compareValue = parseFloat(compareValue);
                }

                if(asc) {
                    if(rowValue > compareValue) {
                        insertAfter = jQuery(this);
                    }
                } else {
                    if(rowValue < compareValue) {
                        insertAfter = jQuery(this);
                    }
                }
            });

            if(insertAfter) {
                jQuery(this).insertAfter(insertAfter);
            } else {
                table.prepend(jQuery(this));
            }
        });
    },

    viewDir: function(path) {
        staticpages.status('Refreshing folder...');
        staticpages.ajaxData('ls', path, null, function(data) {
            if(data != false) {
                jQuery('#staticpages-files').attr('path', data.path);

                var table = jQuery('#staticpages-files tbody');
                table.empty();

                if(data.files.length > 0) {
                    data.files.forEach(file => {
                        var row = '<tr class="item">';
                            row += '<td name="name" data="' + file.name + (file.type == 'Folder' ? '/' : '') + '">';
                            row += '<input type="checkbox" name="file[' + file.name + (file.type == 'Folder' ? '/' : '') + ']"> ';
                                if(file.type == 'File') {
                                    row += file.name;
                                } else {
                                    row += '<a href="#" class="folder" path="' + data.path + file.name + '/">' + file.name + '</a>';
                                }
                            row += '</td>';
                            row += '<td name="size" data="' + file.size + '">' + (file.type == 'File' ? staticpages.bytesToSize(file.size) : file.size) + '</td>';
                            row += '<td name="modtime" data="' + file.modtime + '">' + staticpages.timeSince(file.modtime * 1000) + '</td>';
                            row += '<td><a href="#" class="staticpages-button staticpages-button-copycode" path="' + data.path + file.name + (file.type == 'Folder' ? '/' : '') + '">Copy Code</a></td>';
                            row += '</tr>';

                        jQuery(row).appendTo(table);
                    });
                } else {
                    jQuery('<tr><td colspan="4" class="notice"><span>No files found</span></td></tr>').appendTo(table);
                }

                staticpages.unselectAll();
                staticpages.buildBreadcrumbs(path);
                staticpages.status();
            }
        });
    },

    buildBreadcrumbs: function(path) {
        jQuery('.staticpages-path').attr('path', path);

        var html = '<a href="#" class="folder" path="/">root</a>/';
        var levelPath = '';

        var levels = path.split('/');
        levels.forEach(item => {
            if(item != '') {
                levelPath += item + '/';
                html += '<a href="#" class="folder" path="/' + levelPath + '">' + item + '</a>/';
            }
        });

        jQuery('.staticpages-path').html(html);
    },

    bytesToSize: function(bytes) {
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes == 0) return '0 Byte';
        var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    },

    timeSince: function(timeStamp) {
        var dateObj = new Date(timeStamp);
        return dateObj.toLocaleString();

        // var now = new Date(),
        //   secondsPast = (now.getTime() - timeStamp) / 1000;
        // if (secondsPast < 60) {
        //   return parseInt(secondsPast) + ' secs ago';
        // }
        // if (secondsPast < 3600) {
        //   return parseInt(secondsPast / 60) + ' mins ago';
        // }
        // if (secondsPast <= 86400) {
        //   return parseInt(secondsPast / 3600) + ' hours ago';
        // }
        // if (secondsPast > 86400) {
        //   day = timeStamp.getDate();
        //   month = timeStamp.toDateString().match(/ [a-zA-Z]*/)[0].replace(" ", "");
        //   year = timeStamp.getFullYear() == now.getFullYear() ? "" : " " + timeStamp.getFullYear();
        //   return day + " " + month + year;
        // }
    },

    copyToClipboard: function(text) {
        if (window.clipboardData && window.clipboardData.setData) {
            // Internet Explorer-specific code path to prevent textarea being shown while dialog is visible.
            return clipboardData.setData("Text", text);
    
        }
        else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
            var textarea = document.createElement("textarea");
            textarea.textContent = text;
            textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in Microsoft Edge.
            document.body.appendChild(textarea);
            textarea.select();
            try {
                return document.execCommand("copy");  // Security exception may be thrown by some browsers.
            }
            catch (ex) {
                console.warn("Copy to clipboard failed.", ex);
                return false;
            }
            finally {
                document.body.removeChild(textarea);
            }
        }
    },
    
    ajaxData: function(action, path='', data=null, cb=null, stringify=true, progresscb=null) {
        var formData = new FormData();
        formData.append('action', action);
        formData.append('path', path);
        
        var file = '';

        if(data != null) {
            for(var key in data) {
                if(stringify) {
                    formData.append(key, JSON.stringify(data[key]));
                } else {
                    formData.append(key, data[key]);
                }

                if(data['file']) file = data['file']['name'];
                if(data['webkitRelativePath']) file = data['webkitRelativePath'];
            };
        }

        jQuery.ajax({
            url:            '/lib/plugins/staticpages/ajax.php',
            cache:          false,
            contentType:    false,
            processData:    false,
            async:          true,
            data:           formData,
            type:           'POST',
            xhr:            function() {
                var xhr = jQuery.ajaxSettings.xhr();

                xhr.upload.addEventListener("progress", function(evt) {
                    if (evt.lengthComputable) {
                        var percentComplete = evt.loaded / evt.total;

                        if(typeof(progresscb) === 'function') {
                            progresscb(file, Math.floor(percentComplete * 100));
                        }
                    }
               }, false);

                return xhr;
            },
            success:        function(res, status) {
                if(res.status == 1) {
                    if(typeof(cb) === 'function') {
                        cb(res);
                    }
                } else {
                    staticpages.addError((file != '' ? file + '. ' : '') + 'An unexpected error occured: ' + res.message);
                    cb(false);
                }
            },
            fail:           function(res) {
                staticpages.addError('An unexpected error occured communicating with the site');
                cb(false);
            }
        })
    }    
};
