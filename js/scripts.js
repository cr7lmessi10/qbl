    var googleapis = 'https://www.googleapis.com/books/v1/volumes';
    var titles = [];
    var bookArray = [];
    var googleSearch = 'https://www.googleapis.com/customsearch/v1';
    var bookNumber = 1, index = 0, count = 1;

    var queryParams = {
        q: '',
        maxResults: 3,
        startIndex: index,
        orderBy: 'relevance',
        key: 'AIzaSyC8v9YrPFZ4RoXRvUTRdRVzBoW0_5rFMo0'
    };

    var searchParams = {

        q: '',
        key: 'AIzaSyC8v9YrPFZ4RoXRvUTRdRVzBoW0_5rFMo0',
        cx: '000733570433441572846:0_odbhs2ruk'

    };

    function BookDetails(title, authors, description, rating, stars, pages, link, dlink, dtitle) {

        this.title = title;
        this.authors = authors;
        this.description = description;
        this.rating = rating;
        this.stars = stars;
        this.pages = pages;
        this.link = link;
        this.dlink = dlink;
        this.dtitle = dtitle
    }

    function submitIt(e) {

        if (e && e.keyCode == 13) {

            bookSearch();
        }
    }

    function bookRemove(selectedBook) {

        selectedBook.parentNode.remove();
        if (document.getElementById('bookPreview').innerHTML == '') {
            $(".lB").hide('slow');
            $(".rB").hide('slow');
        }

    }

    function hide() {
        $('#warning').hide();
    }

    $(document).ready(function () {
        $('#warning').hide();
        $(".lB").hide();
        $(".rB").hide();
        
    });

    function generateBookPreview(book, bookNumber) {

        jQuery('<div />', {
            id: bookNumber,
            class: "col-md-4 column"
        }).appendTo('#bookPreview');

        jQuery('<img />', {
            src: book.link,
            class: 'thumbnail',
            alt: "140x140",
        }).appendTo('#' + bookNumber);

        jQuery('<button></button>', {
            class: 'delete',
            alt: "10x10",
            onClick: "bookRemove(this);"
        }).appendTo('#' + bookNumber);
        titles.push(book.title + ' by ' + book.authors);

        jQuery('<dl></dl>').appendTo('#' + bookNumber);

        jQuery('<dt>Book</dt><dd>' + book.title + ' by <i>' + book.authors + '</i></dd>').appendTo('#' + bookNumber + ' dl');

        jQuery('<dt>Description</dt><dd><div class="description">' + book.description + '</dd></div>').appendTo('#' + bookNumber + ' dl');

        jQuery('<dt>Rating</dt><dd><div class="stars">' + book.stars + '</div><dd>').appendTo('#' + bookNumber + ' dl');

        jQuery('<dt>Pages</dt><dd>' + book.pages + '</dd>').appendTo('#' + bookNumber + ' dl');

        jQuery('<div class="panel-group" id="panel-' + bookNumber + '">\
            <div class="panel panel-default">\
                <div class="panel-heading">\
                    <a class="panel-title" data-toggle="collapse" data-parent="#panel-' + bookNumber + '" href="#link-' + bookNumber + '">Download Link</a>\
                </div>\
                <div id="link-' + bookNumber + '" class="panel-collapse collapse">\
                    <div class="panel-body">\
                    </div>\
                </div>\
            </div>\
        </div>').appendTo('#' + bookNumber + ' dl');

        jQuery('<hr>', {}).appendTo('#' + bookNumber);
    }

    function addCourse(books) {
        $(".lB").show('slow');
        $(".rB").show('slow');

        var link;
        if (books.volumeInfo && books.volumeInfo.imageLinks && books.volumeInfo.imageLinks.thumbnail)
            link = books.volumeInfo.imageLinks.thumbnail;
        else
            link = "../src/img/not_available.jpg";
        var title;
        if (books.volumeInfo && books.volumeInfo.title)
            title = books.volumeInfo.title;
        else
            title = 'Not available';
        var authors;
        if (books.volumeInfo && books.volumeInfo.authors)
            authors = books.volumeInfo.authors.join();
        else
            authors = 'Unknown';
        var description;
        if (books.volumeInfo && books.volumeInfo.description)
            description = books.volumeInfo.description;
        else
            description = "Sorry nerd, ain't got info for that!";
        var pages;
        if (books.volumeInfo && books.volumeInfo.pageCount)
            pages = books.volumeInfo.pageCount;
        else
            pages = 'Not available';
        var stars = '';
        if (books.volumeInfo && books.volumeInfo.averageRating) {
            rating = Math.floor(books.volumeInfo.averageRating);
            while (rating != 0) {
                stars += '*';
                rating -= 1;
            }
            stars = '<dd class="stars">' + stars;
        } else
            stars = '<dd>Not available';

        bookArray.push(new BookDetails(title, authors, description, Math.floor(books.volumeInfo.averageRating), stars, pages, link, 'xyz', 'xyz'));

        generateBookPreview(bookArray[bookArray.length - 1], bookNumber);  
                
        bookNumber += 1;




    }

    function ajaxCaller(queryParams) {

        bookNumber = 1;
        $.getJSON(
            googleapis,
            queryParams,
            function (json) {

                $('.load').hide('slow');
                books = json.items;
                index += books.length;

                if (books.length == 0) {
                    $('.rB').fadeTo(2, 0.3);
                    return;
                }
                if (books.length != 0)
                    document.getElementById('bookPreview').innerHTML = '';
                for (var i = 0; i < books.length; i++) {
                    addCourse(books[i]);
                }
                if (index <= 3) {
                    $('.lB').fadeTo(2, 0.3);
                } else {
                    $('.lB').fadeTo(2, 1);
                }
               
                linkGenerator();

            }

        );

    }
    var upperIndex = 0;
    function linkGenerator() {
        count = 1;
        for (i = 0; i < bookNumber - 1; i++) {
            searchParams['q'] = titles[i].replace(/\s+/g, '+') + '+filetype:pdf';
            $.getJSON(
                googleSearch,
                searchParams,
                function (json, status) {
	            var j = bookNumber - 1;
                    bookArray[upperIndex].dlink = json.items[0].link;
                    bookArray[upperIndex].dtitle = json.items[0].title;

                    dLinkGen(bookArray[upperIndex], count);
		    upperIndex = upperIndex + 1;
                    count = count + 1;
                }

            ).error(function () {
                dErrorGen(count);
                count = count + 1;
            });
        }
    }

    function dLinkGen(book, count) {
        jQuery('<a target="_blank" href="' + book.dlink + '" download="' + book.dtitle + '.pdf">Click here to download</a>')
                        .appendTo('#link-' + count + ' .panel-body');
        jQuery('<p><b>Exact PDF is not guaranteed</b></p>').appendTo('#link-' + count + ' .panel-body');

    }

    function dErrorGen(count) {
        jQuery('<p style="color:#D13F31;"><b>This app has exceeded it\'s Google Search daily usage limit</b></p>').appendTo('#link-' + count + ' .panel-body');
    }

    function bookSearch() {

        titles = [];
        bookArray = [];
        bookNumber = 1;
        index = 0;

        document.getElementById('bookPreview').innerHTML = '';
        var params = document.getElementById('courseName').value;
        if (params.length == 0) {
            $('.load').hide('slow');
            $("#warning").show("slow");
            $(".lB").hide();
            $(".rB").hide();
            return;
        }
        $('.load').show('slow');

        queryParams['startIndex'] = index;

        params = params.replace(/\s+/g, '+');
        queryParams['q'] = params;

        if (document.getElementById('checkbox').checked == true) {
            queryParams['orderBy'] = 'newest';
        }

        ajaxCaller(queryParams);
    }

    function rightClicked() {
        titles = [];
        bookNumber = 1;
        if(bookArray.length == index) {
            $('.load').show('slow');
            queryParams['startIndex'] = index;
            ajaxCaller(queryParams);
            return;
        } 

        document.getElementById('bookPreview').innerHTML = '';
        for(var i = index; i < index + 3 && i < bookArray.length; i++) {
            generateBookPreview(bookArray[i], bookNumber);
            if(bookArray[i].dlink == 'xyz' && bookArray[i].dtitle == 'xyz')
               dErrorGen(bookNumber);
            else
               dLinkGen(bookArray[i], bookNumber);
            bookNumber += 1;
        }
        index += bookNumber - 1;
        
        if (index <= 3) {
            $('.lB').fadeTo(2, 0.3);
        } else {
            $('.lB').fadeTo(2, 1);
        }
       
    }

    function leftClicked() {
        titles = [];
        bookNumber = 1;

        index -= 6;
        if (index <= 0) {
            index = 0;
            $('.lB').fadeTo(2, 0.3);
        }
        document.getElementById('bookPreview').innerHTML = '';

        for(var i = index; i < index + 3 && i < bookArray.length; i++) {
            generateBookPreview(bookArray[i], bookNumber);
            if(bookArray[i].dlink == 'xyz' && bookArray[i].dtitle == 'xyz') {
            
               dErrorGen(bookNumber);
            }
            else
               dLinkGen(bookArray[i], bookNumber);
            bookNumber += 1;
        }
        index += bookNumber - 1;

        if (index <= 3) {
            $('.lB').fadeTo(2, 0.3);
        } else {
            $('.lB').fadeTo(2, 1);
        }

       // queryParams['startIndex'] = index;
       // ajaxCaller(queryParams);
    }
