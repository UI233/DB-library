new Vue({
    el: '#file'
  
})

new Vue({
    el : '#single',
    data:{
        bno : '',
        title : '',
        price : '',
        total : '',
        author : '',
        year : '',
        press :'',
        category : ''
    },
    methods:{
        add(){
            let book_data = {
                'bno' : this.bno,
                'title' : this.title,
                'price' : this.price,
                'total' : this.total,
                'author' : this.author,
                'year' : this.year,
                'press' : this.press,
                'category' : this.category
            }

            if(!eval(this.bno))
            {
                alert('书号不能为空')
                return ;
            }

            if(!eval(this.total) || eval(this.total) < 0)
            {
                alert('总量必需为大于0的数字')
                return ;
            }
            console.log(book_data) 
            let request = new XMLHttpRequest()
            request.onreadystatechange = () => {
                if(request.readyState == 4)
                    alert(request.responseText)
            }

            request.open('POST', './single')
            request.send(JSON.stringify(book_data))
        }
    }
})
$('#input-b1').fileinput({
    language: 'zh',
    uploadUrl: './file_upload',
    showCaption: true,//是否显示被选文件的简介
    showUpload: true,//是否显示上传按钮
    showRemove: true,//是否显示删除按钮
    showClose: true,//是否显示关闭按钮
    enctype: 'multipart/form-data',
    uploadAsync:false, //false 同步上传，后台用数组接收，true 异步上传，每次上传一个file,会调用多次接口 
    layoutTemplates: {
    actionUpload: ''//就是让文件上传中的文件去除上传按钮
//      actionDelete: '',//去除删除按钮
    },
    browseClass: 'btn btn-primary',
    maxFileCount: 1,
    minFileCount : 1,
}).on('filebatchuploadsuccess',function(event, data, msg) {
    if(data.response.msg != "Update Completed")
        alert('更新失败')
})