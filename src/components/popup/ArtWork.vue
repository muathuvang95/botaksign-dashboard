<!-- template for the modal component -->
<template>
    <transition name="modal">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-container">
                    <div class="head-content">
                        <h3 class="title-modal">Artwork Amendment</h3>
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
                                <th scope="col" v-for="column in columns">{{column.label}}</th>
                            </tr>
                        </thead> 
                        <tbody>
                            <tr v-for="( artwork , index ) in rows.artworks">
                                <td class="row-aa-oi">
                                    <select name="aa_item_pro[]" class="form-control" @change="updateItem(index , $event , 'product')">
                                        <option value="0">--Select--</option>
                                        <!-- <option v-for="product_item in artwork.product_items" :selected="product_item.id == artwork.item_id" v-bind:value="product_item.id">{{product_item.name}}</option> -->
                                        <option v-for="product_item in artwork.product_items" v-if="artwork.flag == false" :selected="product_item.id == artwork.item_id"  v-bind:value="product_item.id">{{product_item.name}}</option>
                                        <option v-for="product_item in filterProductItems(artwork.product_items)" v-if="artwork.flag == true" :selected="product_item.id == artwork.item_id"  v-bind:value="product_item.id">
                                            {{product_item.name}}
                                        </option>
                                    </select>
                                </td>
                                <td>
                                    <select name="aa_item_issue[]" class="form-control" @change="updateItem(index , $event , 'issue')">
                                            <option value="0">Select Issue</option>
                                            <option v-for="issue_item in rows.issue_items" v-bind:selected="issue_item.name == artwork.item_issue" v-bind:value="issue_item.name">{{issue_item.name}}</option>
                                    </select>
                                </td>
                                <td>
                                    <select name="aa_item_service[]" class="form-control" @change="updateItem(index , $event , 'service')">
                                            <option value="0">Select Service</option>
                                            <option v-for="service_item in rows.service_items" v-bind:selected="service_item.value == artwork.item_service" v-bind:rel="service_item.id" v-bind:value="service_item.value">{{service_item.name}}</option>
                                    </select>
                                </td>
                                <td>
                                   <span class="act-remove-row" @click="removeRow(index , $event)" style="position: relative; left: 5px; cursor: pointer;">
                                        <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
                                             width="18.000000pt" height="25.000000pt"
                                             viewBox="0 0 78.000000 102.000000"
                                             preserveAspectRatio="xMidYMid meet">
                                            <g transform="translate(0.000000,102.000000) scale(0.100000,-0.100000)"
                                               fill="#000000" stroke="none">
                                                <path d="M280 803 c-16 -6 -38 -33 -55 -68 -9 -16 -21 -20 -63 -20 -61 -1 -79
                                                -13 -63 -43 6 -11 18 -22 26 -26 14 -5 16 -30 14 -206 -3 -188 -2 -201 16
                                                -215 16 -11 58 -14 207 -15 l187 0 21 27 c20 26 21 37 19 215 -2 170 0 190 15
                                                201 11 8 17 23 14 38 -3 22 -7 24 -57 24 -51 0 -57 2 -77 33 -13 18 -24 38
                                                -27 45 -4 13 -151 21 -177 10z m141 -64 c34 -18 10 -29 -60 -29 -73 0 -87 6
                                                -70 27 14 16 102 18 130 2z m97 -91 c13 -13 18 -331 6 -362 -5 -14 -29 -16
                                                -165 -16 -145 0 -159 2 -159 18 0 9 -1 92 -2 183 -1 91 2 171 6 177 10 17 297
                                                17 314 0z"/>
                                                <path d="M267 593 c-4 -3 -7 -64 -7 -134 0 -119 1 -128 20 -134 11 -3 24 -3
                                                30 0 6 4 10 61 10 141 0 134 0 134 -23 134 -13 0 -27 -3 -30 -7z"/>
                                                <path d="M402 588 c-19 -19 -17 -242 3 -258 8 -7 22 -10 30 -6 23 8 18 269 -5
                                                274 -9 1 -21 -3 -28 -10z"/>
                                            </g>
                                        </svg>
                                    </span>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="4"><button type="button" class="btn btn-light btn-block"  @click="addArtWork">+</button></td>
                            </tr>
                        </tbody>             
                    </table>
                    <button type="button" @click="updateArtWork()" class="btn btn-light button-confirm">Confirm & Email</button>
                    <slot name="footer">
                        <!--              default footer-->
                        <!--              <button class="modal-default-button" @click="$emit('close')">-->
                        <!--                OK-->
                        <!--              </button>-->
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
        name: 'ArtWork',
        props: {
            ModelOrderId: Number,
            RowIndex: Number,
        },
        data: function() {
            return {
                selected1: 0,
                selected2: 0,
                selected3: 0,
                listProduct: [],
                rows: [],
                columns: [{
                        label: "Order Item",
                        name: "name",
                    },
                    {
                        label: "Issue",
                        name: "issue",
                    },
                    {
                        label: "Service",
                        name: "service",
                    },
                    {
                        label: "",
                        name: "remove",
                    },
                ],
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
            let item1 = '';
            let item1s = [];
            let item2 = '';
            let item2s = [];
            let item3 = '';
            let item3s = [];
            let atrwork = '';
            let artworks = [];
            let flag = false;
            WooCommerce.get('custom/artwork/'+orderId).then(function(result) {
                result.data['issue_items'].forEach(function(v1 , k1) {
                    item1 = {
                        name : v1
                    }
                    item1s.push(item1);
                })
                result.data['product_items'].forEach(function(v2 , k2) {
                    item2 = {
                        name : v2.name,
                        id : v2.item_id,
                    }
                    item2s.push(item2);
                })
                result.data['service_items'].forEach(function(v3 , k3) {
                    item3 = {
                        name : v3.name+' - $'+v3.price,
                        price : v3.price,
                        value : v3.id,
                    }
                    item3s.push(item3);
                })
                if( result.data['artworks'] ) {
                     result.data['artworks'].forEach(function(v4 , k4) {
                        atrwork = {
                           item_id: v4.item_id,
                           item_service: v4.meta_service,
                           item_issue: v4.meta_issue,
                           product_items: item2s,
                           flag: false,
                        }
                        artworks.push(atrwork);
                    })
                }
                self.rows = {
                    issue_items : item1s,
                    product_items : item2s,
                    service_items : item3s,
                    artworks : artworks,
                };
                self.$root.$emit('activeOverlay', false);
            });
        },
        methods : {
            addArtWork: function() {
                self = this; 
                var numRowMax = this.rows.product_items.length;
                var numRowCurrent = this.rows.artworks.length;
                var listProduct = [];
                var pi = this.rows.product_items;
                if( numRowCurrent < numRowMax) {
                    var atrwork = {
                       item_id: '',
                       item_service: 0,
                       item_issue: 0,
                       product_items: pi,
                        flag: true,
                    };
                    this.rows.artworks.push(atrwork);
                    numRowCurrent++;
                }
            },
            filterProductItems: function(array) {
                for (var i = 0; i < this.rows.artworks.length; i++) {
                    var itemId = Number(this.rows.artworks[0].item_id);
                    const items = this.rows.artworks[i].product_items.filter(item => item.id !== itemId);
                    return items;
                }
            },
            updateItem: function(index , event , col) {
                if(col == 'product') {
                    if($(event.path).val() != 0) {
                        this.rows.artworks[index].item_id = $(event.path).val();
                    }
                }
                if(col == 'issue') {
                    this.rows.artworks[index].item_issue = $(event.path).val();
                }
                if(col == 'service') {
                    this.rows.artworks[index].item_service = $(event.path).val();
                }
            },
            removeRow: function(index , event) {
                var self = this;
                var item_id = this.rows.artworks[index].item_id;
                var orderId = this.ModelOrderId;
                var WooCommerce = new WooCommerceRestApi({
                    url: self.$parent.config.url,
                    consumerKey: self.$parent.config.consumerKey,
                    consumerSecret: self.$parent.config.consumerSecret,
                    wpAPI: true,
                    version: 'wc/v3',
                });
                if(this.rows.artworks.length > 1) {
                    this.rows.artworks.splice(index , 1);
                } 
                 WooCommerce.put('custom/del-artwork/'+item_id).then(function(result) {});
            },
            updateArtWork: function() {
                // format input:artworks : [ {item_id , issue_item , service_item} ]  
                var user_id = jQuery("#current-user-id").val() ? jQuery("#current-user-id").val() : 0 ; 
                var data = JSON.stringify(this.rows.artworks); 
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
                WooCommerce.put('custom/artwork/'+orderId , {user_id : user_id , artworks : data}).then(function(result) {
                    self.$root.$emit('updateStatusArtWork', result.data.artworks , self.RowIndex);
                    if(result.data.item_on_hold) {
                        self.$root.$emit('updateEstCompletion', result.data.order_on_hold , result.data.item_on_hold , result.data.check_expiring, self.RowIndex);
                    }
                    if(result.data.order_status) {
                        self.$root.$emit('updateOrderStatusArt', result.data.order_status , self.RowIndex);
                    }
                    if(result.data.item_status) {
                        self.$root.$emit('updateItemStatusArt', result.data.item_status , self.RowIndex);
                    }
                    self.$root.$emit('activeOverlay', false);
                });

            }
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