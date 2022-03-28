console.log("Js Running")
//&key=AIzaSyClZMkawW_kK7MKniOI3CIjEXAJJqp8Wxg
$(document).ready(function () {
    console.log("ready!");
    loadBestSellers("Travel")
});

const $navigationKeys = $(".navigationKey")
const $imageContent = $(".category-image-content")
const $carouselBox = $(".carouselbox")
const $switchLeftButton = $(".switchLeft")
const $switchRightButton = $(".switchRight")
const $searchBox = $("input[type=text]")
const $searchButton = $("button")
const $booksDisplayContent = $(".books-display")
const $wrappedImages = $(".wrapper-images")

let scrollPerClick;
let imagePadding = 20;

let scrollAmount = 0;

console.log($navigationKeys)


$navigationKeys.each((index, element) => {
    $(element).on("click", function (event) {
        console.log(event.target.id)
        let $categoryName

        if (event.target.id === "fiction") {
            $categoryName = "Hardcover Fiction"
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
    })
});

function loadBestSellers($categoryName) {
    $carouselBox.empty()
    // Carousel Buffering
    let $booksArrayBS = []
    let $bookDetailsArrayBS = []
    $.ajax(`https://api.nytimes.com/svc/books/v3/lists.json?list=${$categoryName}&api-key=l7mogI8Uw1dmPCRYM2agAAxa58Q1LszR`)
        .then((data) => {
            console.log(data)
            console.log(data.results)
            $booksArrayBS = data.results
            console.log($booksArrayBS)
            $booksArrayBS.forEach((element) => {
                $bookDetailsArrayBS.push(element.book_details[0])
            });
            let $googleBooksArray = []
            console.log($bookDetailsArrayBS)
            $bookDetailsArrayBS.forEach(element => {
                let ajaxResp = $.ajax(`https://www.googleapis.com/books/v1/volumes?q=${element.title}+isbn:${element.primary_isbn13}`, { async: false });
                // .then((data) => {
                //     // console.log(data)
                //     $googleBooksArray.push(data.items[0])
                // })
                //console.log(ajaxResp.responseJSON.items[0]);
                if (ajaxResp.responseJSON.items && ajaxResp.responseJSON.items.length > 0) {
                    $googleBooksArray.push(ajaxResp.responseJSON.items[0])
                }

            });

            console.log($googleBooksArray)
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
    console.log(scrollAmount, $carouselBox[0].scrollWidth, $carouselBox[0].clientWidth)
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
//volumeInfo.imageLinks
//readingModes.title

$searchButton.on("click", (event) => {
    console.log($searchBox.val())
    $wrappedImages.empty()
    let $inputText = $searchBox.val()
    $.ajax(`https://www.googleapis.com/books/v1/volumes?q=${$inputText}&maxResults=15`)
        .then((data) => {
            console.log(data)
            data.items.forEach((element, index) => {
                console.log(element.volumeInfo.imageLinks.thumbnail)
                console.log(element.volumeInfo.title)
                console.log(element.volumeInfo.publishedDate)
                console.log(element.volumeInfo.description)
                $wrappedImages.append(`<div class="book-tile">
                <div class="tooltip">
                <img class="books-content" src="${element.volumeInfo.imageLinks.thumbnail}"
                    alt="${element.volumeInfo.title}" >
                    <span class="tooltiptext truncate-overflow">${element.volumeInfo.description}</span>
                    </img>
                </div>
                <h4 class="book-title">${element.volumeInfo.title}</h4>
                <h5><i>Published Date: </i>${element.volumeInfo.publishedDate}</h5>
            </div>`)

            });
        })
})


