<!-- template for the modal component -->
<template>
    <transition name="modal">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-container">
                    <div class="head-content">
                        <h3 class="title-modal">List files order items</h3>
                        <div class="right-content">
                            <span class="order-id"><h2 style="display: inline-block;">#{{ModelOrderId}}</h2></span>
                            <button type="button" class="btn btn-modal close" aria-label="Close" @click="$emit('close')">
                                <span aria-hidden="true" style="font-size: 45px!important;">&times;</span>
                            </button>
                        </div>
                        
                    </div>
                    <div class="table-wrapper-scroll-y my-custom-scrollbar">
                        <table class="table table-striped table-bordered">
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Order Item</th>
                                    <th>Download</th>
                                    <th>Size file</th>
                                </tr>
                            </thead> 
                            <tbody>
                                <tr v-for="( row , index) in rows">
                                    <td class="number-no">{{row.no}}</td>
                                    <td class="item-name">{{row.order_item}}</td>
                                    <td class="item-est-date"><a class="btn-download-file cs-download-file" v-bind:href="row.download" target="_blank" download>Download</a></td>
                                    <td class="item-size">{{row.size}}</td>
                                </tr>
                            </tbody>             
                        </table>
                    </div>
                    <div class="text-center" style="padding: 20px 0 0 0">
                        <a class="btn-download-file btn-download-all" v-bind:href="zip" target="_blank" style="margin-right: 10px;">Compress & Download all
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-earmark-zip" viewBox="0 0 16 16">
                              <path d="M5 7.5a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v.938l.4 1.599a1 1 0 0 1-.416 1.074l-.93.62a1 1 0 0 1-1.11 0l-.929-.62a1 1 0 0 1-.415-1.074L5 8.438V7.5zm2 0H6v.938a1 1 0 0 1-.03.243l-.4 1.598.93.62.929-.62-.4-1.598A1 1 0 0 1 7 8.438V7.5z"/>
                              <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1h-2v1h-1v1h1v1h-1v1h1v1H6V5H5V4h1V3H5V2h1V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z"/>
                            </svg>
                        </a>
                        <div class="btn-download-file btn-download-all" @click="clickDownLoadAll($event)">Download All</div>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>


<script >
    import VueBootstrap4Table from 'vue-bootstrap4-table';
    import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
    export default {
        name: 'OrderLog',
        props: {
            ModelOrderId: Number
        },
        data: function() {
            return {
                rows: [],
                zip: '',
                config: {
                    checkbox_rows: false,
                    rows_selectable: true,
                    show_refresh_button: false,
                    show_reset_button: false,
                    global_search: {
                        visibility: false,
                    },
                },
                classes: {
                    tableWrapper: "outer-table-div-class wrapper-class-two",
                    table: {
                        "table-striped my-class": true,
                        "table-bordered my-class-two": function(rows) {
                            return true
                        }
                    },
                    row: {
                        "my-row my-row2": true,
                        "function-class": function(row) {
                            return row.id == 1
                        }
                    },
                    cell: {
                        "my-cell my-cell2": true,
                        "text-danger": function(row, column, cellValue) {
                            return column.name == "salary" && row.salary > 2500
                        }
                    }
                },
            }
        },
        mounted() {
            var self = this;
            var orderId = this.ModelOrderId;
            var WooCommerce = new WooCommerceRestApi({
                url: self.$parent.config.url,
                consumerKey: self.$parent.config.consumerKey,
                consumerSecret: self.$parent.config.consumerSecret,
                wpAPI: true,
                version: 'wc/v3',
            });
            let item = '';
            let items = [];
            WooCommerce.get('custom/list-link/'+orderId).then(function(result) {
                result.data.list.forEach(function(value , key) {
                    item = {
                        no : value.no,
                        order_item : value.name,
                        download : value.link,
                        size : value.size,
                        file_name: value.file_name,
                    }
                    items.push(item);
                })
                self.rows = items;
                self.$root.$emit('activeOverlay', false);
                self.zip = result.data.zip_files;
            });
        },
        methods: {
            clickDownLoadAll() {
                self.$root.$emit('activeOverlay', true);
                var self = this;
                var orderId = this.ModelOrderId;
                var WooCommerce = new WooCommerceRestApi({
                    url: self.$parent.config.url,
                    consumerKey: self.$parent.config.consumerKey,
                    consumerSecret: self.$parent.config.consumerSecret,
                    wpAPI: true,
                    version: 'wc/v3',
                });
                let item = '';
                let items = [];
                WooCommerce.get('custom/zip-s3/'+orderId).then(function(result) {
                     self.$root.$emit('activeOverlay', false);
                });
            },
        },
        components: {
            VueBootstrap4Table,
            WooCommerceRestApi
        }
    } 
</script>
<style scoped>
.modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    display: table;
    transition: opacity .3s ease;
}

.modal-wrapper {
    display: table-cell;
    vertical-align: middle;
}

.modal-container {
    width: 70%;
    margin: 0px auto;
    padding: 20px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
    transition: all .3s ease;
    font-family: Helvetica, Arial, sans-serif;
}

.modal-header h3 {
    margin-top: 0;
    color: #42b983;
}

.modal-body {
    margin: 20px 0;
}

.modal-default-button {
    float: right;
}

/*
   * The following styles are auto-applied to elements with
   * transition="modal" when their visibility is toggled
   * by Vue.js.
   *
   * You can easily play with the modal transition by editing
   * these styles.
   */

.modal-enter {
    opacity: 0;
}

.modal-leave-active {
    opacity: 0;
}

.title-modal {
    text-align: left;
    float: left;
}

.right-content {
    text-align: right;
    padding-right: 5px;
    cursor: pointer;
}
.right-content .order-id {
    margin-right: 20px;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
}

.modal-footer {
    clear: left;
    width: 100%;
}
.my-custom-scrollbar {
position: relative;
max-height: 800px;
overflow: auto;
}
.table-wrapper-scroll-y {
display: block;
}
tr.nb-downloaded {
    background: #35b352;
}
.btn-download-all {
    box-shadow: 0 0 3px #8f8a8a;
    padding: 5px 20px;
    border-radius: 3px;
    color: #706e72;
    background: #fff;
    cursor: pointer;
    display: inline-block;
}
</style>