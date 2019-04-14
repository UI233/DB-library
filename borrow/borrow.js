let main_window = new Vue({
el: '#result',
data: {
    show : true,
    books : [],
    cno : '',
    returnDialog : false,
    borrowDialog : false,
    rcno : '',
    rbno : ''
},
methods : {
    lookup(){
    let request = new XMLHttpRequest()
    request.onreadystatechange = () => {
        if(request.readyState == 4)
        {
            let data = JSON.parse(request.responseText)
            this.books = data.returnData 
        }
    }

    request.open("POST", "/borrow/lookup",true)
    request.send(JSON.stringify({
        id : this.cno
    }))},
    returnBook(){
        let request = new XMLHttpRequest()
        request.onreadystatechange = () => {
                if(request.readyState == 4)
                {
                    location.reload(true)
                }
            }
        request.open("POST", "/borrow/return",true)
        request.send(JSON.stringify({
            bno: this.rbno,
            cno: this.rcno
        }))
    },
    borrowBook(){
        let request = new XMLHttpRequest()
        request.onreadystatechange = () => {
                if(request.readyState == 4)
                {
                    location.reload(true)
                }
            }
        request.open("POST", "/borrow/borrow",true)
        request.send(JSON.stringify({
            bno: this.rbno,
            cno: this.rcno
        }))
    },
}
})