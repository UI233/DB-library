<script src="https://cdn.jsdelivr.net/npm/vue"></script>
<style>
        .dialog{
            }
            .dialog_mask{
                position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
            }
            .dialog_container{
                    background: #fff;
        width: 300px;
        height: 120px;
        position: relative;
        border-radius: 10px;
        margin: 0 auto;
            }
            .dialog_content{
                text-align: center;
        padding-top: 30px;
            }
            .dialog_btn{
                margin-top: 20px;
            }
            .dialog_btn a{
                background: yellow;
                    padding: 2px 30px;
        border-radius: 5px;
        color: #fff;
        text-decoration: none;
            width: 50px;
        display: inline-block;
            }
            .dialog_btn a:nth-child(2){
                    margin-left: 20px;
            }
    </style>

<template id="dialog">
        <div class="dialog" v-if="isShow">
            <div class="dialog_mask"></div>
            <div class="dialog_container">
                <div class="dialog_content">
                    <div class="dialog_btn">
                        <input type="text" placeholder="请输入管理员账号" id="username">
                        <input type="password" placeholder="请输入密码" id="passwd"><br> 
                        <button @click="submit">登录</button>
                        <button @click="cancel">取消</button>
                    </div>
                </div>
            </div>
        </div>
</template>

<script>
    Vue.component('v-dialog', {
            template: '#dialog',
            props : {
                name: String,
                isShow : {
                    type : Boolean,
                    default : false
                }
            },
            data : function()
            {
                return {
                    show : false
                }
            },
            methods:{
                cancel : function() {this.$emit('close-diag')},
                submit : function() {
                    let user = document.getElementById("username").value
                    let passwd = document.getElementById("passwd").value
                    alert(user)
                }
            },
            created:function(){

            }

        })
</script>

<div>
<v-dialog id="app1" :is-show="show" @close-diag = "close"></v-dialog>
</div>
<button id="app" @click="hhh">???</button> 
<script>
let app1 = new Vue(
    {
        el : "#app1",
        data : {
            show : false
        },
        methods :{
            close : function()
            {
                this.show = false
            }
        }
    }
)

let app = new Vue(
    {
        el : "#app",
        methods : {
            hhh : function() {
                app1.show = true;
            }
        }
    }
)
</script>