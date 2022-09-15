<!-- template for the modal component -->
<template>
    <transition name="modal">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-container">
                    <div class="head-content">
                        <h3 class="title-modal">Error (Reprint)</h3>
                        <div class="right-content">
                            <span class="order-id"><h2 style="display: inline-block;">#{{ModelOrderId}}</h2></span>
                            <button type="button" class="btn btn-modal close" aria-label="Close" @click="$emit('close')">
                                <span aria-hidden="true" style="font-size: 45px!important;">&times;</span>
                            </button>
                        </div>
                        
                    </div>
                    <!--          <div class="modal-footer">-->
                    <table class="table table-striped table-bordered">
                        <thead>
                            <tr>
                                <th colspan="2">Order Item</th>
                                <th>Est. Completion Date / Time</th>
                                <th>New Date / Time</th>
                            </tr>
                        </thead> 
                        <tbody>
                            <tr v-for="( row , index) in rows">
                                <td class="number-no">{{row.item_no}}</td>
                                <td class="item-name">{{row.item_name}}</td>
                                <td class="item-est-date">{{row.item_est_date}}</td>
                                <td class="item-due-date">
                                    <div class="row">
                                        <div class="col-md-6">
                                            <input class="form-control" @change="changeDate( index , $event)" type="date">
                                        </div>
                                        <div class="col-md-6">
                                            <input class="form-control" @change="changeTime( index , $event)" type="time">
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>             
                    </table>
                    <slot name="footer">
                        <button class="btn btn-light" @click="RePrintError">Confirm & Update</button>
                    </slot>
                    <!--          </div>-->
                </div>
            </div>
        </div>
    </transition>
</template>
<script >
    import VueBootstrap4Table from 'vue-bootstrap4-table';
    import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
    export default {
        name: 'RePrint',
        props: {
            ModelOrderId: Number,
            RowIndex: Number,
        },
        data: function() {
            return {
                rows: [],
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
            let item = '';
            let items = [];
            WooCommerce.get('custom/items/'+orderId).then(function(result) {
                result.data.forEach(function(value , key) {
                    item = {
                        item_no : value.order_no+1,
                        item_id : value.item_id,
                        item_name : value.name,
                        item_est_date : value.date_completed,
                        item_select_date : '',
                        item_select_time : '',
                    }
                    items.push(item);
                })
                self.rows = items;
                self.$root.$emit('activeOverlay', false);
            });
        },
        methods: {
            RePrintError() {
                var user_id = jQuery("#current-user-id").val() ? jQuery("#current-user-id").val() : 0 ;
                var new_date = JSON.stringify(this.rows);
                var self = this;
                self.$root.$emit('activeOverlay', true);
                var orderId = this.ModelOrderId;
                var WooCommerce = new WooCommerceRestApi({
                    url: self.$parent.config.url,
                    consumerKey: self.$parent.config.consumerKey,
                    consumerSecret: self.$parent.config.consumerSecret,
                    wpAPI: true,
                    version: 'wc/v3',
                });
                WooCommerce.put('custom/items/'+orderId , {user_id: user_id , new_date : new_date }).then(function(result) {
                    var update_order_time = '';
                    if(result.data !== null) {
                        if( result.data.order_new_date != '') {
                            update_order_time = result.data.order_new_date;
                        }
                        self.$root.$emit('updateItemRePrint', result.data.item_new_date , update_order_time , result.data.check_expiring , self.RowIndex);
                        result.data.item_new_date.forEach(function(value , key) {
                            self.rows[key].item_est_date = value;
                        });
                    }
                    self.$root.$emit('activeOverlay', false);
                });
            },
            changeDate: function( index , event) {
                this.rows[index].item_select_date = $(event.path).val();
            },
            changeTime: function( index , event) {
                this.rows[index].item_select_time = $(event.path).val();
            }
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

</style>