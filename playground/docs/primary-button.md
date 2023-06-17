# Primary button

## Basic usage

Use the `color` property to change the style of the button. 

There are currently 4 styles available.

@[example](@/examples/button/btn-1.vue)

## Disabled state 2

Set the `disabled` prop to disable button default functionality.

@[example](@/examples/button/btn-2.vue)


## Links

You can render an `<a>` element by providing an `href` prop value. 

You may also generate `<nuxt-link>` when providing a value for the `to` prop.

@[example](@/examples/button/links.vue)

## Loading state

Use `loading` property to temporarily disable interaction with component and indicate loading state.

@[example](@/examples/button/spinner.vue)

When using this property, the width of the button does not change.

Here's what the loading indicator looks like with different button styles:

@[example](@/examples/button/spinner-colors.vue)

@[api](@comp/Button/ButtonPrimary.vue)
