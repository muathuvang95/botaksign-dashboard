<template>
    <tr v-show="row.display" class="row-item-detail">
        <td colspan="16">
            <table>
                <tr>
                    <td>Item no</td>
                    <td>Reupload</td>
                    <td>Product</td>
                    <td>Qty</td>
                    <td>Item status</td>
                    <td>Product Time</td>
                    <td>Completion</td>
                    <td>Date/time out</td>
                </tr>
                <tr v-for="(product) in row.data_child.child_product">
                    <td>{{ product.item_no }}</td>
                    <td><a v-show="product.download != '' " v-bind:href="product.download"><button class="btn btn-primary" download>Download</button></a><span v-show="product.download == '' ">-</span></td>
                    <td>{{ product.product }}</td>
                    <td>{{ product.qty }}</td>
                    <td>
                        <select v-if="product.user_can == 'edit' && product.item_status != 'pending_payment' " name="status_item" class="form-control" @change="updateStatus(row.index , product.item_id , row.order_id , $event)">
                            <option v-show=" key != 'pending_payment'" :selected="key == product.item_status" v-for="(item , key) in row.data_child.status" v-bind:value="key">{{item}}</option>
                        </select>
                        <button v-if="product.user_can == 'view' || product.item_status == 'pending_payment'" class="btn-status-item">{{row.data_child.status[product.item_status]}}</button>
                    </td>
                    <td>
                        {{ product.product_time }}
                        
                    </td>
                    <td>
                        <div v-if="product.item_on_hold != 'on_hold'" v-bind:style="product.expiring == 'expiring' ? 'font-weight:700; color: #f00;' : ''">{{ product.completion }}</div>
                        <button @click="updateOnHold(row.index , product.item_id , row.order_id ,product.item_no ,$event)" class="btn btn-outline-secondary" v-if="product.item_on_hold == 'on_hold'">On Hold</button>
                    </td>
                    <td>{{ product.date_time }}</td>
                </tr>
            </table>
        </td>
    </tr>
</template>
<script>
    import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
    export default {
    data: function() {
        return {
            
        }
    },
    name: 'ChildTable',
    props: {
        row: {
            type: Object,
            required: true
        }
    },
    methods: {
        updateStatus: function(index , item_id , order_id, event) {
            var user_id = jQuery("#current-user-id").val() ? jQuery("#current-user-id").val() : 0 ; 
            self = this;
            self.$root.$emit('activeOverlay', true);
            var WooCommerce = new WooCommerceRestApi({
                url: self.$parent.config.url,
                consumerKey: self.$parent.config.consumerKey,   
                consumerSecret: self.$parent.config.consumerSecret,
                wpAPI: true,
                version: 'wc/v3',
            });
            var status = $(event.path).val();
            WooCommerce.put('custom/items/'+order_id , {status : status , item_id: item_id , user_id : user_id}).then(function(result) {
                var item = result.data;
                var order_status = item.order_status;
                var date_time_out = item.date_time_out;
                var payment_status = item.payment_status;
                self.$root.$emit('updateOrderStatus', order_status , date_time_out , payment_status , index, item.user_can);
                self.$root.$emit('activeOverlay', false);
            });
        },
        updateOnHold: function(index , item_id , order_id, item_no , event) {
            self = this;
            self.$root.$emit('activeOverlay', true);
            var WooCommerce = new WooCommerceRestApi({
                url: self.$parent.config.url,
                consumerKey: self.$parent.config.consumerKey,   
                consumerSecret: self.$parent.config.consumerSecret,
                wpAPI: true,
                version: 'wc/v3',
            });
            var status = 'processing';
            var update_est = 'update';
            WooCommerce.put('custom/items/'+order_id , {status : status , item_id: item_id , update_est: update_est}).then(function(result) {
                var item = result.data;
                var order_status = item.order_status;
                self.$root.$emit('updateClickOnHold', order_status , item.order_date_completed ,index);
                self.$root.$emit('updateButtonOnHold', item.date_completed, item.status , item_no ,index);
                self.$root.$emit('activeOverlay', false);
            });
        }
    },
    components: {
        WooCommerceRestApi
    }

}
</script>
<style scoped>
    .row-item-detail>td {
        background: #e0e0e0;
        padding: 29px 15%;
    }
    .row-item-detail>td>table {
        background: #fff;
        border-radius: 5px;
    }
</style>
