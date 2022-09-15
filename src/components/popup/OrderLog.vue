<!-- template for the modal component -->
<template>
    <transition name="modal">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-container">
                    <div class="head-content">
                        <h3 class="title-modal">Order Log</h3>
                        <div class="right-content">
                            <span class="order-id"><h2 style="display: inline-block;">#{{ModelOrderId}}</h2></span>
                            <button type="button" class="btn btn-modal close" aria-label="Close" @click="$emit('close')">
                                <span aria-hidden="true" style="font-size: 45px!important;">&times;</span>
                            </button>
                        </div>
                        
                    </div>
                    <!--          <div class="modal-footer">-->
                    <vue-bootstrap4-table :rows="rows" :columns="columns" :config="config" :classes="classes" @rowWasEdited=" rows = $event"></vue-bootstrap4-table>
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
                config: {
                    checkbox_rows: false,
                    rows_selectable: true,
                    show_refresh_button: false,
                    show_reset_button: false,
                    global_search: {
                        visibility: false,
                    },
                },
                columns: [
                    {
                        label : 'Date',
                        name : 'date'
                    },
                    {
                        label : 'Order Item',
                        name : 'order_item'
                    },
                    {
                        label : 'Changes',
                        name : 'changes'
                    },
                    {
                        label : 'User',
                        name : 'user'
                    },
                ],
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
            WooCommerce.get('custom/notes/'+orderId).then(function(result) {
                result.data.forEach(function(value , key) {
                    item = {
                        date : value.date,
                        order_item : value.order_item,
                        changes : value.changes,
                        user : value.user
                    }
                    items.push(item);
                })
                self.rows = items;
                self.$root.$emit('activeOverlay', false);
            });
        },
        // methods: {
        //   changePagination() {
        //     debugger;
        //     $('.input-group').last().find('.form-control').attr('style','width:70px');
        
        //   }
        // },
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