<?php
if (!defined('ABSPATH')) exit;

/**
 * Taxonomy 1 → Image Group (Media Filter System)
 */
add_action('init', function () {

    register_taxonomy('smm_image_group', 'attachment', [
        'label' => 'Image Groups',
        'hierarchical' => true,
        'show_ui' => true,
        'show_admin_column' => true,
    ]);

    /**
     * Taxonomy 2 → Content Group (Posts/Pages dropdown)
     */
    register_taxonomy('smm_content_group', ['post', 'page'], [
        'label' => 'Content Groups',
        'hierarchical' => true,
        'show_ui' => true,
        'show_admin_column' => true,
    ]);

});
