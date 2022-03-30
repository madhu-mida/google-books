console.log("Js Running")
//&key=AIzaSyClZMkawW_kK7MKniOI3CIjEXAJJqp8Wxg
$(document).ready(function () {
    console.log("ready!");
    loadBestSellers("Travel")
});

myStorage = window.localStorage;

const $navigationKeys = $(".navigationKey")
const $imageContent = $(".category-image-content")
const $carouselBox = $(".carouselbox")
const $switchLeftButton = $(".switchLeft")
const $switchRightButton = $(".switchRight")
const $searchBox = $("input[type=text]")
const $searchButton = $("button")
const $booksDisplayContent = $(".books-display")
const $wrappedImages = $(".wrapper-images")
const $favouriteList = $(".favorites-list")
const $clearButton = $("#clear-button")
const $bestSellerCategorySpan = $("#bs-category")

let scrollPerClick;
let imagePadding = 20;

let scrollAmount = 0;

let $favoriteListArray = myStorage.getItem("favoriteBooks") ? myStorage.getItem("favoriteBooks").split(",") : []


console.log($navigationKeys)


$navigationKeys.each((index, element) => {
    $(element).on("click", function (event) {
        console.log(event.target.id)
        let $categoryName
        // Checking which link has been clicked using target.id
        if (event.target.id === "fiction") {
            $categoryName = "Hardcover Fiction" //nyt - listNames
        } else if (event.target.id === "nonfiction") {
            $categoryName = "Hardcover Nonfiction"
        } else if (event.target.id === "sports") {
            $categoryName = "Sports"
        } else if (event.target.id === "health") {
            $categoryName = "Health"
        } else if (event.target.id === "science") {
            $categoryName = "Science"
        } else if (event.target.id === "travel") {
            $categoryName = "Travel"
        } else if (event.target.id === "politics") {
            $categoryName = "Hardcover Political Books"
        } else if (event.target.id === "food") {
            $categoryName = "Food and Fitness"
        } else if (event.target.id === "business") {
            $categoryName = "Hardcover Business Books"
        }

        //$imageContent.empty()

        loadBestSellers($categoryName)
        $bestSellerCategorySpan.html((event.target.text))
    })
});

function loadBestSellers($categoryName) {
    $carouselBox.empty()
    // Carousel Buffering
    let $booksArrayBS = []
    let $bookDetailsArrayBS = []
    $.ajax(`https://api.nytimes.com/svc/books/v3/lists.json?list=${$categoryName}&api-key=l7mogI8Uw1dmPCRYM2agAAxa58Q1LszR`)
        .then((data) => {
            console.log("NYT Data ", data)
            console.log("NYT Data.Results ", data.results)
            $booksArrayBS = data.results
            console.log("BooksArrayBS ", $booksArrayBS)
            $booksArrayBS.forEach((element) => {
                $bookDetailsArrayBS.push(element.book_details[0])
            });
            let $googleBooksArray = []
            console.log("BookDetailsArray ", $bookDetailsArrayBS)
            $bookDetailsArrayBS.forEach(element => {
                let ajaxResp = $.ajax(`https://www.googleapis.com/books/v1/volumes?q=${element.title}+isbn:${element.primary_isbn13}`, { async: false });
                // .then((data) => {
                //     // console.log(data)
                //     $googleBooksArray.push(data.items[0])
                // })
                console.log("ResponseJson ", ajaxResp.responseJSON);
                if (ajaxResp.responseJSON.items && ajaxResp.responseJSON.items.length > 0) {
                    $googleBooksArray.push(ajaxResp.responseJSON.items[0])
                }

            });

            console.log("GoogleBooksArray: ", $googleBooksArray)
            $googleBooksArray.forEach((element, index) => {
                $carouselBox.append(`<img class="img-${index} slider-img" src="${element.volumeInfo.imageLinks.thumbnail}" alt="${element.volumeInfo.readingModes.title}">`)

            });

            scrollPerClick = document.querySelector(".img-1").clientWidth + imagePadding;

        })
}

function sliderScrollLeft() {
    $carouselBox[0].scrollTo({
        //top: 0,
        left: (scrollAmount -= scrollPerClick),
        behavior: "smooth"
    })
    if (scrollAmount < 0) {
        scrollAmount = 0
    }
}

function sliderScrollRight() {
    console.log("scrollAmount- ", scrollAmount, " $carouselBox[0].scrollWidth- ", $carouselBox[0].scrollWidth, " $carouselBox[0].clientWidth- ", $carouselBox[0].clientWidth)
    //Scrolled --> scrollAmount
    //Yet to be scrolled or remaining content--> $carouselBox[0].scrollWidth - $carouselBox[0].clientWidth
    if (scrollAmount <= $carouselBox[0].scrollWidth - $carouselBox[0].clientWidth) {
        $carouselBox[0].scrollTo({
            //top: 0,
            left: (scrollAmount += scrollPerClick),
            behavior: "smooth"
        })
    }
}

$switchLeftButton.on("click", () => {
    sliderScrollLeft()
})
$switchRightButton.on("click", () => {
    sliderScrollRight()
})


$searchButton.on("click", (event) => {
    console.log("Search Box Value: ", $searchBox.val())
    $wrappedImages.empty()
    let $inputText = $searchBox.val()
    $.ajax(`https://www.googleapis.com/books/v1/volumes?q=${$inputText}&maxResults=15`)
        .then((data) => {
            console.log("Google Api Data: ", data)
            data.items.forEach((element, index) => {
                if (element.volumeInfo.imageLinks && element.volumeInfo.imageLinks.thumbnail) {
                    console.log("ImageLinks: ", element.volumeInfo.imageLinks)
                    console.log("Title: ", element.volumeInfo.title)
                    console.log("PublishedDate: ", element.volumeInfo.publishedDate)
                    console.log("Description: ", element.volumeInfo.description)
                    let $isLiked = $favoriteListArray.includes(element.volumeInfo.title) ? "liked" : ""
                    let $favIcon = $favoriteListArray.includes(element.volumeInfo.title) ? "fa-heart" : "fa-heart-o"
                    $wrappedImages.append(`<div class="book-tile ${$isLiked}">
                    <div class="tooltip">
                    <img class="books-content" src="${element.volumeInfo.imageLinks.thumbnail}"
                        alt="${element.volumeInfo.title}" >
                        <span class="tooltiptext truncate-overflow">${element.volumeInfo.description}</span>
                        </img>
                    </div>
                    <a class="book-link" href="${element.volumeInfo.canonicalVolumeLink}" target="_blank"><h4 class="book-title">${element.volumeInfo.title}</h4></a>
                    <h6 class="book-title-pd">Published Date: ${element.volumeInfo.publishedDate}</h5>
                    <span class="heart"><i class="fa ${$favIcon}" aria-hidden="true"></i> </span>

                </div>`)
                }
            });


            $(".heart").click(function (event) {
                console.log("ParentNode: ", $(this.parentNode))
                let $selectedBook = $(this.parentNode).children(".book-link").text()
                if ($(this.parentNode).hasClass("liked")) {
                    // User removing or unliking the book from favorites
                    $(this).html('<i class="fa fa-heart-o" aria-hidden="true"></i>');
                    //remove from localstorage
                    $favoriteListArray.splice($favoriteListArray.indexOf($selectedBook), 1);
                } else {
                    $(this).html('<i class="fa fa-heart" aria-hidden="true"></i>');
                    //add to localstorage
                    $favoriteListArray.push($selectedBook)

                }
                // Adding or removing the liked class as applicable
                $(this.parentNode).toggleClass("liked");
                //console.log("re", $(this.parentNode).children(".book-title").text())
                console.log("FavoriteListArray", $favoriteListArray)
                myStorage.setItem("favoriteBooks", $favoriteListArray)
                $favouriteList.empty()
                $favoriteListArray.forEach(element => {
                    $favouriteList.append(`<h5>${element}</h5>`)
                });
                if ($favoriteListArray.length > 0) {
                    $clearButton.prop("disabled", false)
                } else {
                    $clearButton.prop("disabled", true)
                }
            });

        })
})

const $navBar = $(".top-header")
let sticky = $navBar.offset().top;


window.onscroll = function () {
    console.log("onScroll")
    stickyNavigation()
}

function stickyNavigation() {
    console.log(window.pageYOffset)
    console.log(sticky)
    if (window.pageYOffset >= sticky) {
        console.log("adding sticky")
        // $navBar.classList.add("sticky")
        $navBar.addClass("sticky")
    } else {
        console.log("removing sticky")
        // $navBar.classList.remove("sticky")
        $navBar.removeClass("sticky")
    }
}

//Executes on PageLoad to populate the favorite section
$favoriteListArray.forEach(element => {
    $favouriteList.append(`<h5>${element}</h5>`)
});

if ($favoriteListArray.length <= 0) {
    $clearButton.prop("disabled", true)
}

$clearButton.on("click", () => {
    $favoriteListArray.length = 0
    $favouriteList.empty()
    myStorage.removeItem("favoriteBooks")
    $clearButton.prop("disabled", true)
})



