
$("#js-user-type-selector").change(function () {
    let value = $(this).val();
    switch (value) {
        case "user":
            if ($("#js-subcriber-table").hasClass("display-none")) {
                $("#js-subcriber-table").removeClass("display-none");
            }
            if (!$("#js-editor-table").hasClass("display-none")) {
                $("#js-editor-table").addClass("display-none");
            }
            if (!$("#js-writer-table").hasClass("display-none")) {
                $("#js-writer-table").addClass("display-none");
            }
            break;
        case "writer":
            if ($("#js-writer-table").hasClass("display-none")) {
                $("#js-writer-table").removeClass("display-none");
            }
            if (!$("#js-editor-table").hasClass("display-none")) {
                $("#js-editor-table").addClass("display-none");
            }
            if (!$("#js-subcriber-table").hasClass("display-none")) {
                $("#js-subcriber-table").addClass("display-none");
            }
            break;
        case "editor":
            if ($("#js-editor-table").hasClass("display-none")) {
                $("#js-editor-table").removeClass("display-none");
            }
            if (!$("#js-subcriber-table").hasClass("display-none")) {
                $("#js-subcriber-table").addClass("display-none");
            }
            if (!$("#js-writer-table").hasClass("display-none")) {
                $("#js-writer-table").addClass("display-none");
            }
            break;
    }
});