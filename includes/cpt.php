<?php
if (!defined('ABSPATH')) exit;

/**
 * CPT for grouping pages/posts (Taxonomy usage requirement)
 */
add_action('init', function () {

    register_post_type('smm_group', [
        'label' => 'Content Groups',
        'public' => false,
        'show_ui' => true,
        'supports' => ['title'],
    ]);
});