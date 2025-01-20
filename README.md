# postajaxify v1.0.0

The jQuery plugin to "postajaxify"  WordPress post queries with filters enhances user experience by allowing dynamic, real-time filtering of WordPress posts without reloading the page. By integrating seamlessly with the WordPress backend, it enables users to apply various filters (e.g., categories, tags, custom taxonomies) and instantly update the displayed posts through AJAX requests. This reduces page load times and provides a smooth, interactive browsing experience. The plugin is customizable, offering support for both default and custom post types, and ensures compatibility with popular page builders and themes, making it a versatile solution for any WordPress site aiming to improve content discovery.

## Version
1.0.0

## Contirbutor 
[@vishalpadhariya](https://vishalpadhariya.github.io)

## Link
[GitHub Repository](https://github.com/vishalpadhariya/postajaxify)

## License
MIT

## Parameters

- `ajaxurl` (string): The URL to use for AJAX calls.
- `action` (string): The AJAX action to trigger.
- `type` (string): The event type to trigger the AJAX call (`onChange` or `onSubmit`).
- `callbacks` (object): Callback functions to trigger at different stages of the AJAX call.

### Callback functions:

- `beforeSend` (function): Triggered before the AJAX request is sent.
- `afterSend` (function): Triggered after the AJAX request is sent.
- `onSuccess` (function): Triggered when the AJAX request is successful.
- `onError` (function): Triggered if there is an error with the AJAX request.

## Example Usage

### Example 1: Initialize with `onChange` event type

```js
$('#filters-form').postajaxify(ajaxurl, 'filter_posts', 'onChange', {
   beforeSend: function () {
     console.log('Before sending AJAX request...');
  },
  afterSend: function () {
     console.log('After sending AJAX request...');
  },
  onSuccess: function (response) {
     console.log('AJAX request successful:', response);
  },
  onError: function (xhr, status, error) {
     console.error('AJAX request error:', error);
  }
});
```

### Example 2: Initialize with `onSubmit` event type

```js
$('#filters-form').postajaxify(ajaxurl, 'filter_posts', 'onSubmit', {
   beforeSend: function () {
     console.log('Before sending AJAX request...');
  },
  afterSend: function () {
     console.log('After sending AJAX request...');
  },
  onSuccess: function (response) {
     console.log('AJAX request successful:', response);
  },
  onError: function (xhr, status, error) {
     console.error('AJAX request error:', error);
  }
});
```

## How It Works

1. The plugin can be initialized on a `form` element.
2. It listens for specific changes or form submissions to trigger AJAX requests based on filter values.
3. Filter values are collected and sent as AJAX parameters to the specified `ajaxurl`.
4. Callback functions can be provided to handle different stages of the request (before, after, success, error).

## Installation

1. Include jQuery and the `postajaxify.js` script in your project.
2. Initialize the plugin by selecting a form element and calling `.postajaxify()` on it.

```html
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="path/to/postajaxify.js"></script>
```

## Dependencies

- jQuery

## License

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
