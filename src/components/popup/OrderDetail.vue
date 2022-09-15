<!-- template for the modal component -->
<template>
    <transition name="modal">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-container">
                    <div class="head-content">
                        <h3 class="title-modal">Order Detail</h3>
                        <div class="right-content">
                            <span class="order-id"><h2 style="display: inline-block;">#{{ModelOrderId}}</h2></span>
                            <button type="button" class="btn btn-modal close" aria-label="Close" @click="$emit('close')">
                                <span aria-hidden="true" style="font-size: 45px!important;">&times;</span>
                            </button>
                        </div>
                        
                    </div>
                    <!--          <div class="modal-footer">-->
                    <table class="table table-borderless table-bordered">
                        <thead>
                            <tr>
                                <th>Billing Details</th>
                                <th>Order Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="text-left" style="border: 1px #d9d9d9 solid">
                                    <tr>
                                        <td><b>Name</b></td>
                                        <td>{{rows.name}}</td>
                                    </tr>
                                    <tr>
                                        <td><b>Company</b></td>
                                        <td>{{rows.company}}</td>
                                    </tr>
                                    <tr>
                                        <td><b>Address</b></td>
                                        <td>{{rows.delivery_address}}</td>
                                    </tr>
                                    <tr>
                                        <td><b>Email</b></td>
                                        <td>
                                            <a v-bind:href="rows.email_value">{{rows.email}}</a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><b>Phone</b></td>
                                        <td>
                                            <a v-bind:href="rows.phone_value">{{rows.phone}}</a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><b>Payment via</b></td>
                                        <td>{{rows.payment_title}}</td>
                                    </tr>
                                </td>
                                <td class="text-right" style="border: 1px #d9d9d9 solid">
                                    <tr>
                                        <td><b>INVOICE NO.</b></td>
                                        <td>{{rows.invoice_no}}</td>
                                    </tr>
                                    <tr>
                                        <td><b>Invoice Date</b></td>
                                        <td>{{rows.invoice_date}}</td>
                                    </tr>
                                    <tr>
                                        <td><b>Order Number</b></td>
                                        <td>{{rows.order_id}}</td>
                                    </tr>
                                    <tr>
                                        <td><b>Order Date</b></td>
                                        <td>
                                            {{rows.order_date}}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><b>Payment Method</b></td>
                                        <td>
                                            {{rows.payment_title}}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td>
                                            
                                        </td>
                                    </tr>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div></div>
                    <div class="table-product-detail">
                        <table class="table table-striped table-bordered">
                            <thead>
                                <tr>
                                    <th>Show</th>
                                    <th>Product</th>
                                    <th align="right">Quantity</th>
                                    <th align="right">Tax</th>
                                    <th align="right">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                <template v-for="(data , index ) in meta_data">
                                    <tr>
                                        <td>
                                            <button class="btn-show-order" v-if="data.has_meta == 'has_meta'" v-on:click="showMetaData(data.index , $event)">
                                                <svg v-if="!data.display_meta_data" width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-caret-down-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
                                                </svg>
                                                <svg v-else-if="data.display_meta_data" width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-caret-up-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M7.247 4.86l-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
                                                </svg>
                                            </button>
                                        </td>
                                        <td v-html="data.name"></td>
                                        <td align="right"> {{data.qty}}</td>
                                        <td align="right" v-html="data.tax">{{data.tax}}</td>
                                        <td align="right" v-html="data.total">{{data.total}}</td>
                                    </tr>
                                    <tr v-show="data.display_meta_data">
                                        <template>
                                            <td colspan="5" style="padding: 29px 15%;">
                                                <table style="width: 100%">
                                                    <tr v-for="item in data.meta_item">
                                                        <td style="font-weight: 700" v-html="item.key"></td>
                                                        <td v-html="item.value"></td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </template>
                                    </tr>
                                </template>
                            </tbody>
                        </table>
                    </div>
                    <button class="btn btn-light"><a  class="link_download_order_detail" target="_blank" v-bind:href="download">Download Order Detail</a></button>
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
                rows: {},
                download: {},
                meta_data: {},
                config: {
                    checkbox_rows: false,
                    rows_selectable: true,
                    show_refresh_button: false,
                    show_reset_button: false,
                    card_title: "Vue Bootsrap 4 advanced table",
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
                }
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
            let order = '';
            let item = '';
            let items = [];
            WooCommerce.get('custom/order-detail/'+orderId).then(function(result) {
                var value_order = result.data.orders;
                order = { 
                    name: value_order.full_name,
                    company: value_order.billing.company,
                    payment_title: value_order.payment_method_title,
                    payment: value_order.payment_method,
                    payment_status: value_order.payment_status,
                    delivery_method: value_order.shipping_method,
                    delivery_address: value.shipping.address_1 + " " + value.shipping.address_2,
                    phone: value_order.phone,
                    email: value_order.email,
                    phone_value: value_order.phone_value,
                    email_value: value_order.email_value,
                    invoice_date: value_order.invoice_date,
                    order_id: value_order.order_id,
                    order_date: value_order.order_date,
                    invoice_no: value_order.invoice_no,
                };
                self.rows = order;
                var value_item = result.data.item;
                value_item.forEach(function( value , key ) {
                    let meta_item = '';
                    let meta_items = [];
                    item = {
                        index: value.index,
                        has_meta : value.has_meta,
                        qty : value.qty,
                        tax : value.tax,
                        name : value.name,
                        total : value.total,
                        display_meta_data: false,
                        meta_item : {},
                    };
                    if(value.meta_data) {
                        value.meta_data.forEach(function( v , k ) {
                            meta_item = {
                                key : v.key,
                                value : v.value,
                            };
                            meta_items.push(meta_item);
                        })
                    } 
                    item.meta_item = meta_items;
                    items.push(item);
                })
                self.meta_data = items;
                self.download = result.data.download;
                self.$root.$emit('activeOverlay', false);
            });
        },
        methods: {
            showMetaData(index , event) {
                this.meta_data[index].display_meta_data = !this.meta_data[index].display_meta_data;
            }
        },
        components: {
            VueBootstrap4Table,
            WooCommerceRestApi,
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
.link_download_order_detail {
    color: #000;
}
.link_download_order_detail:hover {
    text-decoration: none;
}
/* button.btn-show-order {
    width: 30px;
    height: 30px;
    background: #fff;
    box-shadow: 0 0 2px #8f8a8a;
    border-radius: 3px;
    font-size: 10px;
    color: #6d6e70; 
}
button.btn-show-order:focus {
    border: none;
    outline: unset;
    background: #f2f2f2;
    box-shadow: inset 0 0 2px #8f8a8a;
}*/

</style>