console.log("Js Running")

const $navigationKeys = $(".navigationKey")
const $imageContent = $(".category-image-content")

console.log($navigationKeys)


$navigationKeys.each((index, element) => {
    $(element).on("click", function (event) {
        console.log(event.target.id)
        let $categoryName
        let $booksArrayBS = []
        let $bookDetailsArrayBS = []
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

        $imageContent.empty()
        $.ajax(`https://api.nytimes.com/svc/books/v3/lists.json?list=${$categoryName}&api-key=l7mogI8Uw1dmPCRYM2agAAxa58Q1LszR`)
            .then((data) => {
                console.log(data)
                console.log(data.results)
                $booksArrayBS = data.results.slice(0, 3)
                console.log($booksArrayBS)
                $booksArrayBS.forEach((element) => {
                    $bookDetailsArrayBS.push(element.book_details[0])
                });
                let $googleBooksArray = []
                console.log($bookDetailsArrayBS)
                $bookDetailsArrayBS.forEach(element => {
                    let ajaxResp = $.ajax(`https://www.googleapis.com/books/v1/volumes?q=${element.title}+isbn:${element.primary_isbn13}&key=AIzaSyClZMkawW_kK7MKniOI3CIjEXAJJqp8Wxg`, { async: false });
                    // .then((data) => {
                    //     // console.log(data)
                    //     $googleBooksArray.push(data.items[0])
                    // })
                    //console.log(ajaxResp.responseJSON.items[0]);
                    $googleBooksArray.push(ajaxResp.responseJSON.items[0])
                });

                console.log($googleBooksArray)
                $googleBooksArray.forEach(element => {
                    $imageContent.append(`<img class="bs-images" src="${element.volumeInfo.imageLinks.thumbnail}" alt="${element.volumeInfo.readingModes.title}">`)

                });

            })
    })
});

//volumeInfo.imageLinks
//readingModes.title