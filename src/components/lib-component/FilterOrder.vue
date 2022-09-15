    <template>
    <div>
        <input v-if="this.column.name == 'order_id'" type="number" min="0" class="form-control" name="search_order" @change ="customSearch($event)">
        <input v-else-if="this.column.name == 'company'" type="text"  class="form-control" name="search_order" @change ="customSearch($event)">
        <input v-else-if="this.column.name == 'name'" type="text"  class="form-control" name="search_order" @change ="customSearch($event)">
        <input v-else-if="this.column.name == 'date_time'" type="date"  class="form-control" name="search_order" @change ="customSearch($event)">
        <input v-else-if="this.column.name == 'date_time_out'" type="date"  class="form-control" name="search_order" @change ="customSearch($event)">
    </div>
</template>
<script>
    import Multiselect from 'vue-multiselect'
    import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
    import { eventBus } from '../../main';
    export default {
        name: "FilterOrder",
        props: {
            column: {
                type: Object,
                default: function() {
                    return {};
                }
            },
            searchSpecialistValue: {
                type: Array,
                required: false
            }
        },
        data: function() {
            return {
                order_id_input: '',
                data_search : {},
            };
        },
        methods: {
            updateFilterHandler: function (event) {
                this.$emit('get-column', {
                    "value": event.target.value,
                    "column": this.column
                });
            },
            customSearch: function(event) {
                this.$root.$emit( 'activeOverlay' , true);
                var specialist_linking = jQuery("#specialist-linking").val();
                var self = this;
	      		var WooCommerce = new WooCommerceRestApi({
                    url: self.$parent.config.url,
                    consumerKey: self.$parent.config.consumerKey,
                    consumerSecret: self.$parent.config.consumerSecret,
                    wpAPI: true,
                    version: 'wc/v3',
                });
                var orders = [];
	            let item = '';
                let items = [];
                var specialistItem = '';
                var specialist = [];
                var totalRowsAfterSearch = 0;
                switch (self.column.name) {
                    case 'order_id':
                        self.$parent.optionsSearch.id =event.target.value
                        break
                    case 'company': 
                        self.$parent.optionsSearch.company = event.target.value
                        break
                    case 'name': 
                        self.$parent.optionsSearch.name = event.target.value
                        break
                    case 'date_time_out': 
                        self.$parent.optionsSearch.date_out = event.target.value
                        break
                    case 'date_time': 
                        self.$parent.optionsSearch.date_in = event.target.value
                        break
                    default: 
                        break
                }
                if (self.searchSpecialistValue.length) {
                    self.searchSpecialistValue.forEach(function(value , key) {
                        specialistItem = {
                            name: value.name,
                            id: value.id
                        }
                        specialist.push(specialistItem);
                    })
                }
                if(specialist.length || specialist_linking) {
                    specialist = specialist.length ? JSON.stringify(specialist) : JSON.stringify(JSON.parse(specialist_linking));
                }

                self.$parent.optionsSearch.per_page = self.$parent.config.per_page;
                self.$parent.optionsSearch.page = 1;
                self.$parent.optionsSearch.specialist = specialist;
                WooCommerce.get('custom/search' , self.$parent.optionsSearch ).then(function(result) {
                    orders = result.data.orders;
                    totalRowsAfterSearch = result.data.total;
                    if (orders == null) {   
                        eventBus.$emit('orderUpdate', []);
                    } else {
                        orders.forEach(function(value , key) {
                            item = {
                               index: key,
                                order_id: value.id,
                                show: 1,
                                special_list: value.specialist.name,
                                order_file: value.link_download,
                                status: value.status,
                                date_time: value.date_created,
                                expiring: value.expiring,
                                completion: value.date_completed,
                                order_on_hold: value.order_on_hold,
                                date_time_out: value.order_time_out,
                                name: value.full_name,
                                company: value.shipping.company,
                                payment_title: value.payment_method_title,
                                payment: value.payment_method,
                                payment_status: value.payment_status,
                                delivery_method:  value.shipping_method,
                                delivery_address: value.shipping.address_1 + " " + value.shipping.address_2,
                                pdf_invoice : value.pdf_invoice,
                                order_detail : value.order_detail,
                                level: 1,
                                show_child: false, 
                                hasChild: 1,
                                display: false,
                                data_child: {}
                            };
                            items.push(item);
                        })
                        eventBus.$emit('orderUpdate', items);
                    }
                    self.$root.$emit( 'activeOverlay' , false);
                    self.$root.$emit('resetPagition', true);
                    self.$root.$emit('getTotalRowsAfterSearch', totalRowsAfterSearch);
                    self.$root.$emit( 'boardOnWork' , true);
                });
            }
        }
    };
</script>
