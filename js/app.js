/****************************
GLOBAL VARIABLES
/***************************/

var studentsPerPage = 10; // In case it was required to show less students in the future
var $students = $(".student-list").children(); // List of students
var $paginationPlaceholder = $("<div></div>").addClass("pagination"); // Placeholder to put the different pagination lists
var $searchQuery = $students; // Variable to hold any search query done with the Search button
var $noDataToDisplayMsg = $('<div class="no-data-message"><p><strong>Oh snap! </strong>Your query didn\'t return any result</p></div>'); // No data to display message
var typingTimer; // Timer to control when the user is typing too fast in the search bar


/****************************
FUNCTIONS
****************************/

// Calculates number of pages necessary to show the students in groups of studentsPerPage
var getNumberOfPages = function($setOfStudents) {
    return Math.ceil($setOfStudents.length / studentsPerPage);
};

// Build the lower page navigation with the number of pages determined before
var buildPagination = function($setOfStudents) {
    // Only build the pagination if the there are more students in the set than the number of students per page
    if ($setOfStudents.length > studentsPerPage) {
        // Set the ul that will contain the links for pagination
        var $ul = $("<ul></ul>");
        // For each page create a different list item
        var pages = getNumberOfPages($setOfStudents);
        for (var i = 1; i <= pages; i++) {
            // Create a list item element
            var $li = $("<li></li>");
            // Create an anchor element with href="#" and with the number of the page as text
            var $a = $("<a></a>").attr("href", "#").text(i);
            // Append the anchor element to the list item
            $li.append($a);
            // Append the list item to the ul
            $ul.append($li);
        }
        // Append the list to the pagination placeholder
        $paginationPlaceholder.html($ul);
    } else {
        // Fix case when there were pagination links and the set doesn't have enough students to build pagination
        $paginationPlaceholder.html("");
    }
};

// Event handlers for pagination links
// Goes to the specific page showing the specific entries in the studentsList
var goToPage = function(event) {
    // Prevent link clicks to fire its default behavior
    event.preventDefault();

    // Get the clicked page index to know from where to start showing students
    var pageIndex = $(this).text();

    // Show the results based on the clicked page index
    showResults(pageIndex);
};

// Shows the results on the page
var showResults = function(pageIndex) {
    // Hide all the set of students
    $students.each(function() {
        $(this).hide();
    });

    // Show the selected students in the existing query (in case a search has been performed)
    var startAt = (pageIndex - 1) * studentsPerPage;
    var endAt = pageIndex * studentsPerPage;
    $searchQuery.slice(startAt, endAt).each(function() {
        // Show results with an animation
        $(this).show("slow");
    });
};

// Sets .active in the clicked link and removes it from the previous one 
var selectActive = function() {
    // Remove active from the previous active link
    $(".active").removeClass("active");
    // Set active class to the selected page
    $(this).addClass("active");
};

// Searches using the value from the input and returns the nodes to show
var search = function() {
    // Set the query to students, so a new search contains all the users
    $searchQuery = $students;

    // Get the value from the input
    var searchInput = $(".student-search input").val().toLowerCase(); // Accepting upper and lowercase

    // Array to hold the search results
    var results = [];

    // Search over every student
    $searchQuery.each(function() {
        // Get a reference from the student and its data
        var $student = $(this);
        var $studentData = $student.children();

        // Get the name of the student
        var name = $studentData.children("h3").text().toLowerCase(); // Accepting upper and lowercase

        // Get the email of the student
        var email = $studentData.children(".email").text().toLowerCase(); // Accepting upper and lowercase

        // In case a name or an email coincidence was found, push the result to the results array
        if (name.indexOf(searchInput) > -1 || email.indexOf(searchInput) > -1) {
            results.push($student);
        }
    });

    return $(results);
};

// Handler for the search events
var searchEventHandler = function() {
    // Perform a search
    $searchQuery = search();

    // Control if there are no results in the searchQuery
    if ($searchQuery.length === 0) {
        // Show the no data to display message
        $noDataToDisplayMsg.show();
    } else {
        // Hide the message
        $noDataToDisplayMsg.hide();
    }
    // Re-build pagination to contain the new selected elements
    buildPagination($searchQuery);

    // Show results on the first page
    showResults(1);

    // Trigger the first pagination link to show the first subset of elements
    $(".pagination ul li").children().first().click();
};

// Function to create the basic layout of the page
var layout = function() {
    // Build Pagination
    buildPagination($students);
    // Build Student search bar
    $(".page-header").append('<div class="student-search"><input placeholder="Search for students..."><button>Search</button></div>');
    // Append the pagination placeholder to the .page div
    $(".page").append($paginationPlaceholder);
    // Add and hide the message placeholder
    $noDataToDisplayMsg.hide();
    $(".page").append($noDataToDisplayMsg);
};

// Function to register the different page listeners
var registerListeners = function() {
    // Pagination links - for student pagination and set active page
    $(".pagination").on("click", "li a", goToPage).on("click", "li a", selectActive);
    // Search button - to search for students
    $(".student-search button").click(function() {
        // Perform a search
        searchEventHandler();
        // Clear the field once clicking the button
        $(".student-search input").val("");
    });
    // Add a keyup event handler when typing a search
    // Implements a mechanism for when the user clicks very fast (the 500 ms has been decided after testing several times)
    $(".student-search input")
        .on("keyup", function() {
            clearTimeout(typingTimer);
            typingTimer = setTimeout(searchEventHandler, 500);
        }).on("keydown", function() {
            clearTimeout(typingTimer);
        });

    // Event triggering
    // Trigger the first pagination link to show the first 10 students
    $(".pagination ul li").children().first().click();
};

/****************************
APP WORKFLOW
****************************/

// PAGE LAYOUT:
layout();

// EVENT LISTENERS:
registerListeners();