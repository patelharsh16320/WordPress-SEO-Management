jQuery(document).ready(function ($) {
    /* =========================================
   TITLE COUNTER
========================================= */
    function updateTitleCounter(input) {
        let value = $(input).val().length;
        let counter = $(input)
            .siblings('.smm-title-count');
        counter.text(value + ' / 60');
        counter.removeClass(
            'good warning danger'
        );
        if (value >= 30 && value <= 60) {
            counter.addClass('good');
        } else if (value > 60) {
            counter.addClass('danger');
        } else {
            counter.addClass('warning');
        }
    }
    /* =========================================
       DESC COUNTER
    ========================================= */
    function updateDescCounter(input) {
        let value = $(input).val().length;
        let counter = $(input)
            .siblings('.smm-desc-count');
        counter.text(value + ' / 160');
        counter.removeClass(
            'good warning danger'
        );
        if (value >= 80 && value <= 160) {
            counter.addClass('good');
        } else if (value > 160) {
            counter.addClass('danger');
        } else {
            counter.addClass('warning');
        }
    }
    /* =========================================
       LIVE EVENTS
    ========================================= */
    $(document).on(
        'keyup input change',
        '.smm-meta-title',
        function () {
            updateTitleCounter(this);
        }
    );
    $(document).on(
        'keyup input change',
        '.smm-meta-desc',
        function () {
            updateDescCounter(this);
        }
    );
    /* =========================================
       AUTO INIT
    ========================================= */
    function initCounters() {
        $('.smm-meta-title').each(function () {
            updateTitleCounter(this);
        });
        $('.smm-meta-desc').each(function () {
            updateDescCounter(this);
        });
    }
    /* =========================================
       AJAX AUTO DETECT
    ========================================= */
    $(document).ajaxComplete(function () {
        initCounters();
    });
    initCounters();
});