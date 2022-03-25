console.log("Js Running")

const $navigationKeys = $(".navigationKey")


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

        $.ajax(`https://api.nytimes.com/svc/books/v3/lists.json?list=${$categoryName}&api-key=l7mogI8Uw1dmPCRYM2agAAxa58Q1LszR`)
            .then((data) => {
                console.log(data)
            })
    })
});

