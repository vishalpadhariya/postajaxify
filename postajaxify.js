/**
 * postajaxify v1.0.1
 * 
 * A jQuery plugin to AJAXify WordPress post queries with filters.
 * 
 * @version 1.0.1
 * @link https://github.com/vishalpadhariya/postajaxify
 * @license MIT
 * 
 * @param {string} ajaxurl The URL to use for AJAX calls.
 * @param {string} action The AJAX action to trigger.
 * @param {string} psottype The post type to filter.
 * @param {string} type The event type to trigger the AJAX call ('onChange' or 'onSubmit').
 * @param {object} callbacks Callback functions to trigger at different stages of the AJAX call.
 * @returns {object} The jQuery object for chaining.
 * 
 * @example
 * // Initialize the plugin on a form element with onChange event type and default callbacks only for beforeSend and afterSend events.
 * $('#filters-form').postajaxify(ajaxurl, 'filter_posts', 'post', 'onChange', {
 *    beforeSend: function () {
 *      console.log('Before sending AJAX request...');
 *   },
 *  afterSend: function () {
 *      console.log('After sending AJAX request...');
 *  },
 *  onSuccess: function (response) {
 *      console.log('AJAX request successful:', response);
 *  },
 *  onError: function (xhr, status, error) {
 *      console.error('AJAX request error:', error);
 *  }
 * });
 * 
 * @example
 * // Initialize the plugin on a form element with onSubmit event type and custom callbacks only for beforeSend and onSuccess events 
 * $('#filters-form').postajaxify(ajaxurl, 'filter_posts', 'post', 'onSubmit', {
 *    beforeSend: function () {
 *      console.log('Before sending AJAX request...');
 *   },
 *  afterSend: function () {
 *      console.log('After sending AJAX request...');
 *  },
 *  onSuccess: function (response) {
 *      console.log('AJAX request successful:', response);
 *  },
 *  onError: function (xhr, status, error) {
 *      console.error('AJAX request error:', error);
 *  }
 * });
 * 
 */

(function ($) {
    $.fn.postajaxify = function (ajaxurl, action, psottype, type, callbacks) {
        // Plugin initialization
        this.each(function () {
            var $form = $(this);

            if (!$form.is('form')) {
                console.error('postajaxify must be initialized on a form element.');
                return;
            }

            // Objects to store taxonomy, meta filters, and text/date fields
            var taxonomyFilters = {};
            var metaFilters = {};
            var textFilters = {};
            var dateFilters = {};

            // Function to update the filters and make the AJAX call
            function updateFilters() {
                taxonomyFilters = {}; // Reset taxonomy filters
                metaFilters = {}; // Reset meta filters
                textFilters = {}; // Reset text filters
                dateFilters = {}; // Reset date filters

                // Iterate over elements with data-taxfilter, data-metafilter, and other filters
                $form.find('[data-taxfilter], [data-metafilter], [data-textfilter], [data-datefilter]').each(function () {
                    var $element = $(this);

                    // Get the value based on input type
                    var value;
                    if ($element.is(':checkbox, :radio')) {
                        if ($element.is(':checked')) {
                            value = $element.val();
                        } else {
                            return; // Skip unchecked checkboxes or radios
                        }
                    } else if ($element.is('input[type="text"], input[type="date"], input[type="datetime-local"]')) {
                        value = $element.val().trim();
                    } else {
                        value = $element.val();
                    }

                    // Skip empty values
                    if (!value) {
                        return;
                    }

                    // Handle taxonomy filters
                    if ($element.attr('data-taxfilter')) {
                        var taxKey = $element.attr('data-taxfilter');
                        if (!taxonomyFilters[taxKey]) {
                            taxonomyFilters[taxKey] = [];
                        }
                        var multiselect_true = $element.attr('multiple');
                        if (multiselect_true !== undefined) {
                            taxonomyFilters[taxKey].push(value);
                        } else {
                            taxonomyFilters[taxKey] = value;
                        }
                    }

                    // Handle meta filters
                    if ($element.attr('data-metafilter')) {
                        var metaKey = $element.attr('data-metafilter');
                        if (!metaFilters[metaKey]) {
                            metaFilters[metaKey] = [];
                        }
                        var multiselect_true = $element.attr('multiple');
                        if (multiselect_true !== undefined) {
                            metaFilters[metaKey].push(value);
                        } else {
                            metaFilters[metaKey] = value;
                        }
                    }

                    // Handle text input filters (global or meta-specific search)
                    if ($element.attr('data-textfilter')) {
                        var textKey = $element.attr('data-textfilter');
                        textFilters[textKey] = value;
                    }

                    // Handle date filters (single date or date range)
                    if ($element.attr('data-datefilter')) {
                        var dateKey = $element.attr('data-datefilter');
                        var dateValue = value;
                        if (!dateFilters[dateKey]) {
                            dateFilters[dateKey] = '';
                        }
                        dateFilters[dateKey] = dateValue;
                    }
                });

                // Prepare data for AJAX
                var ajaxData = {
                    action: action,
                    psottype: psottype,
                    taxonomyFilters: taxonomyFilters,
                    metaFilters: metaFilters,
                    textFilters: textFilters,
                    dateFilters: dateFilters
                };

                // Trigger the beforeSend callback if provided
                if (callbacks && typeof callbacks.beforeSend === 'function') {
                    callbacks.beforeSend(ajaxData);
                }

                // Perform AJAX call and return a promise
                return $.ajax({
                    url: ajaxurl,
                    method: 'POST',
                    data: ajaxData,
                    beforeSend: function () {
                        // Trigger beforeSend callback if provided
                        if (callbacks && typeof callbacks.beforeSend === 'function') {
                            callbacks.beforeSend();
                        }
                    },
                    complete: function () {
                        // Trigger afterSend callback if provided
                        if (callbacks && typeof callbacks.afterSend === 'function') {
                            callbacks.afterSend();
                        }
                    }
                }).then(
                    function (response) {
                        // Trigger onSuccess callback if provided
                        if (callbacks && typeof callbacks.onSuccess === 'function') {
                            callbacks.onSuccess(response);
                        }
                        console.log('Ajax response retrieved.');
                        return response; // Return the response for chaining
                    },
                    function (xhr, status, error) {
                        // Trigger onError callback if provided
                        if (callbacks && typeof callbacks.onError === 'function') {
                            callbacks.onError(xhr, status, error);
                        }
                        console.error('AJAX error:', error);
                        return $.Deferred().reject({
                            status: status,
                            error: error
                        });
                    }
                );
            }

            // Handle input change or form submit based on the type parameter
            if (type === 'onChange') {
                // Trigger AJAX call on input change
                $form.on('change', 'select, input[type=checkbox], input[type=radio], input[type=text], input[type=date], input[type=datetime-local]', function () {
                    updateFilters().then(
                        function (response) {
                            console.log('Filters successfully updated.');
                        },
                        function (error) {
                            console.error('Error updating filters:', error);
                        }
                    );
                });
            }

            if (type === 'onSubmit') {
                // Trigger AJAX call on form submit
                $form.on('submit', function (e) {
                    e.preventDefault(); // Prevent the form from reloading the page
                    updateFilters().then(
                        function (response) {
                            console.log('Filters successfully updated.');
                        },
                        function (error) {
                            console.error('Error updating filters:', error);
                        }
                    );
                });
            }
        });

        return this; // For chaining
    };
})(jQuery);
