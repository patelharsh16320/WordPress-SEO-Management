<?php

/**
 * Plugin Name: Smart Meta Manager
 * Description: SEO Media + Content Manager
 * Author: Harsh Patel
 * Version: 1.0
 */
if (!defined('ABSPATH')) exit;

define('SMM_PATH', plugin_dir_path(__FILE__));
define('SMM_URL', plugin_dir_url(__FILE__));
require_once SMM_PATH . 'includes/cpt.php';
require_once SMM_PATH . 'includes/taxonomies.php';
require_once SMM_PATH . 'includes/media-ui.php';
require_once SMM_PATH . 'includes/content-ui.php';
require_once SMM_PATH . 'includes/ajax.php';

/* =========================
   ADMIN ASSETS
========================= */
add_action('admin_enqueue_scripts', function () {
    wp_enqueue_style(
        'smm-admin',
        SMM_URL . 'assets/css/admin.css'
    );
    wp_enqueue_script(
        'smm-admin',
        SMM_URL . 'assets/js/admin.js',
        ['jquery'],
        null,
        true
    );
    wp_enqueue_script(
        'smm-content',
        SMM_URL . 'assets/js/content-manage.js',
        ['jquery'],
        null,
        true
    );
    wp_localize_script('smm-admin', 'smm_ajax', [
        'ajaxurl' => admin_url('admin-ajax.php')
    ]);
    wp_localize_script('smm-content', 'smm_ajax', [
        'ajaxurl' => admin_url('admin-ajax.php')
    ]);
});
