<?php
if (!defined('ABSPATH')) exit;

/* =========================================
   META TITLE LENGTH
========================================= */
function smm_get_title_score_class($length) {

    if ($length == 0) {
        return 'smm-danger';
    }

    if ($length < 30) {
        return 'smm-warning';
    }

    if ($length >= 30 && $length <= 60) {
        return 'smm-good';
    }

    return 'smm-danger';
}

/* =========================================
   META DESC LENGTH
========================================= */
function smm_get_desc_score_class($length) {

    if ($length == 0) {
        return 'smm-danger';
    }

    if ($length < 70) {
        return 'smm-warning';
    }

    if ($length >= 120 && $length <= 160) {
        return 'smm-good';
    }

    return 'smm-danger';
}