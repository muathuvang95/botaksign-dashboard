<template>
    <div id="hello-world">
        <vue-bootstrap4-table :rows="rows" :columns="columns" :config="config" :classes="classes" :showLoader="showLoader" @multiSearch="rows = $event" @orderUpdate=" rows = $event">
            <template slot="show" slot-scope="props">
                <button class="btn-show-order" v-on:click="showOrder(props.row, !props.row.show_child , $event)">
                    <svg v-if="!props.row.show_child" width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-caret-down-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
                    </svg>
                    <svg v-else-if="props.row.show_child" width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-caret-up-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.247 4.86l-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
                    </svg>
                </button>
            </template>
            <template slot="special_list" slot-scope="props">
                <div v-if="props.row.special_list != 'No Specialist'" class="child-td">{{props.row.special_list}}</div>
                <div v-else-if="props.row.special_list == 'No Specialist'" class="child-td">
                    <button class="btn-specialist" v-on:click="selectSpecialist(props.row.index, props.row.order_id, $event)" >No Specialist</button>
                </div>
            </template>
            <template slot="order_file" slot-scope="props">
                <div class="btn-order-file">
                    <a v-bind:href="props.row.order_file" v-if="props.row.order_file && props.row.order_file != 'zip_fail'" type="button" class="btn-download-file" download >
                        <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-file-earmark-arrow-down-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" d="M2 2a2 2 0 0 1 2-2h5.293A1 1 0 0 1 10 .293L13.707 4a1 1 0 0 1 .293.707V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2zm7.5 1.5v-2l3 3h-2a1 1 0 0 1-1-1zm-1 4a.5.5 0 0 0-1 0v3.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 2a.5.5 0 0 0 .708 0l2-2a.5.5 0 0 0-.708-.708L8.5 11.293V7.5z"/>
                        </svg>
                        Download
                    </a>
                    <a @click="showListDownLoad(props.row,$event)" v-else-if="props.row.order_file == 'zip_fail'" type="button" class="btn-download-file btn-download-file-error" download >
                        <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-file-earmark-arrow-down-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" d="M2 2a2 2 0 0 1 2-2h5.293A1 1 0 0 1 10 .293L13.707 4a1 1 0 0 1 .293.707V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2zm7.5 1.5v-2l3 3h-2a1 1 0 0 1-1-1zm-1 4a.5.5 0 0 0-1 0v3.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 2a.5.5 0 0 0 .708 0l2-2a.5.5 0 0 0-.708-.708L8.5 11.293V7.5z"/>
                        </svg>
                        Download
                    </a>    
                    <span v-else>-</span>
                </div>
            </template>
            <template slot="status" slot-scope="props">
                <button v-if="props.row.status =='Pending'" type="button" class="btn-status btn btn-secondary">Pending</button>
                <button v-else-if="props.row.status =='New'" type="button" class="btn-status btn btn-completed">New</button>
                <button v-else-if="props.row.status =='Ongoing'" type="button" class="btn-status btn btn-warning">Ongoing</button>
                <button v-else-if="props.row.status =='Completed'" type="button" class="btn-status btn btn-success">Completed</button>
                <button v-else-if="props.row.status =='Collected'" type="button" class="btn-status btn btn-primary">Collected</button>
                <button v-else-if="props.row.status =='Cancelled'" type="button" class="btn-status btn btn-danger">Cancelled</button>
            </template>
            <template slot="completion" slot-scope="props">
                <div class="completion">
                        <div v-if="props.row.order_on_hold != 'on_hold' " v-bind:style="props.row.expiring == 'expiring' ? 'font-weight:700; color: #f00;' : ''">{{props.row.completion}}</div>
                        <b v-if="props.row.order_on_hold == 'on_hold' ">On Hold</b>
                </div>
            </template>

            <template slot="date_time_out"slot-scope="props">
                <div v-if="props.row.date_time_out" class="date-time-out">
                        <div>
                            <svg v-if="props.row.status == 'Cancelled'" width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-check-circle" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-4.646-2.646a.5.5 0 0 0-.708-.708l-6 6a.5.5 0 0 0 .708.708l6-6z"/>
                            </svg>
                            {{props.row.date_time_out}}
                        </div>
                </div>
                <span v-else>-</span>
            </template>
            <template slot="payment_icon" slot-scope="props">
                <div class="child-td">
                    <svg v-if="props.row.payment_status == 'paid'" width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-check-circle" fill="green" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                        <path fill-rule="evenodd" d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z" />
                    </svg>
                    <svg v-else-if="props.row.payment_status == 'pendding' " width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-clock" fill="red" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm8-7A8 8 0 1 1 0 8a8 8 0 0 1 16 0z" />
                        <path fill-rule="evenodd" d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5z" />
                    </svg>
                    <svg v-else-if="props.row.payment_status == 'cancelled' " xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-slash-circle-fill" viewBox="0 0 16 16">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-4.646-2.646a.5.5 0 0 0-.708-.708l-6 6a.5.5 0 0 0 .708.708l6-6z"/>
                    </svg>
                </div>
            </template>
            <template slot="payment" slot-scope="props">
                <div class="child-td">
                    <!-- <div v-if="props.row.payment == 'cod'">
                        <button  type="button" class="btn btn-grey" @click="updatePaymentStatus(props.row)">{{props.row.payment_title}}</button>
                    </div> -->
                    <div>
                        {{props.row.payment_title}}
                    </div>
                </div>
            </template>
            <template slot="delivery_method" slot-scope="props">
                <div class="child-td">{{props.row.delivery_method}}</div>
            </template>
            <template slot="delivery_address" slot-scope="props">
                <div class="child-td">{{props.row.delivery_address}}</div>
            </template>
            <template slot="order_detail" slot-scope="props">
                <div class="order-detail-list dropdown">
                    <button class="btn btn-outline-secondary dropdown-toggle"  id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-file-earmark-text" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 0h5.5v1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h1V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2z"/>
                            <path d="M9.5 3V0L14 4.5h-3A1.5 1.5 0 0 1 9.5 3z"/>
                            <path fill-rule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"/>
                        </svg>
                    </button>
                    <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                        <li class="dropdown-item cs-order-detail">
                            <svg  width="1em" height="1em" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-file-earmark-medical">
                              <path d="M7.5 5.5a.5.5 0 0 0-1 0v.634l-.549-.317a.5.5 0 1 0-.5.866L6 7l-.549.317a.5.5 0 1 0 .5.866l.549-.317V8.5a.5.5 0 1 0 1 0v-.634l.549.317a.5.5 0 1 0 .5-.866L8 7l.549-.317a.5.5 0 1 0-.5-.866l-.549.317V5.5zm-2 4.5a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zm0 2a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5z"/>
                              <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z"/>
                            </svg>
                            <a class="list-select" v-bind:href="props.row.order_detail" target="_blank">Order Details</a>
                        </li>
                        <li v-if="props.row.pdf_invoice  != ''" class="dropdown-item cs-invoice invoice-pdf-paid">
                            <svg  width="1em" height="1em" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-file-code">
                              <path d="M6.646 5.646a.5.5 0 1 1 .708.708L5.707 8l1.647 1.646a.5.5 0 0 1-.708.708l-2-2a.5.5 0 0 1 0-.708l2-2zm2.708 0a.5.5 0 1 0-.708.708L10.293 8 8.646 9.646a.5.5 0 0 0 .708.708l2-2a.5.5 0 0 0 0-.708l-2-2z"/>
                              <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2zm10-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1z"/>
                            </svg>
                            <a class="list-select" v-bind:href="props.row.pdf_invoice"  target="_blank">Invoice</a>
                        </li>
                        <li class="dropdown-item cs-artwork">
                            <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-journal-text" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2z"/>
                                <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1z"/>
                                <path fill-rule="evenodd" d="M5 10.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"/>
                            </svg>
                            <a @click="showArtWork(props.row,$event)" class="list-select" href="#">Artwork Amendment</a>
                        </li>
                        <li class="dropdown-item cs-error">
                            <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-x" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                            </svg>
                            <a @click="showRePrint(props.row,$event)" class="list-select" href="#">Error (Reprint)</a>
                        </li>
                        <li class="dropdown-item cs-order-log">
                            <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-file-earmark-check" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                              <path d="M4 0h5.5v1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h1V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2z"/>
                              <path d="M9.5 3V0L14 4.5h-3A1.5 1.5 0 0 1 9.5 3z"/>
                              <path fill-rule="evenodd" d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
                            </svg>
                            <a @click="showOrderLog(props.row,$event)" class="list-select" href="#">Order Log</a>
                        </li>
                    </ul>
                </div>
            </template>

        </vue-bootstrap4-table>
        <Specialist :ModelOrderLogId="ModelOrderLogId" v-if="showModalSpecialist" @close="closePopup()" :rows="rows" :config="config" :ModelIndex="ModelIndex"></Specialist>
        <ArtWork :ModelOrderId="ModelOrderId" :RowIndex="RowIndex" v-if="showModalArtWork" @close="closePopup()"></ArtWork>
        <RePrint :ModelOrderId="ModelOrderId" :RowIndex="RowIndex" v-if="showModalRePrint" @close="closePopup()"></RePrint>
        <!-- <OrderDetail :ModelOrderId="ModelOrderId" v-if="showModalOrderDetail" @close="closePopup()"></OrderDetail> -->
        <OrderLog :ModelOrderId="ModelOrderId" v-if="showModalOrderLog" @close="closePopup()"></OrderLog>
        <ListDownLoad :ModelOrderId="ModelOrderId" v-if="showModalListDownLoad" @close="closePopup()"></ListDownLoad>
    </div>
</template>
<script>
    import VueBootstrap4Table from './lib-component/VueBootstrap4Table';
    import Specialist from "./popup/Specialist";
    import SearchSpecialist from './lib-component/SearchSpecialist';
    import ArtWork from "./popup/ArtWork";
    import RePrint from "./popup/RePrint";
    import OrderLog from "./popup/OrderLog";
    import OrderDetail from "./popup/OrderDetail";
    import ListDownLoad from "./popup/ListDownLoad";
    import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
    import axios from "axios";
    import { eventBus } from '../main';

    export default {
        name: 'OrderDashboard',
        data: function() {
            return {
                rows: [],
                columns: [{
                        label: "Show",
                        name: "show",
                        display: false,
                    }, 
                    {
                        label: "Special List",
                        name: "special_list",
                    },
                    {
                        label: "Order No.",
                        name: "order_id",
                        filter: {
                            type: "FilterOrder"
                        }
                    },
                    {
                        label: "Order file",
                        name: "order_file",
                    },
                    {
                        label: "Order Details",
                        name: "order_detail",
                    },
                    {
                        label: "Status",
                        name: "status",
                        filter: {
                            type: "MultiSearch",
                            mode: "single",
                            closeDropdownOnSelection: true,
                            placeholder: "All",
                            options: [
                                {
                                    "name": "Pending",
                                    "value": "Pending"
                                },
                                {
                                    "name": "New",
                                    "value": "New"
                                },
                                {
                                    "name": "Ongoing",
                                    "value": "Ongoing"
                                },
                                {
                                    "name": "Completed",
                                    "value": "Completed"
                                },
                                {
                                    "name": "Collected",
                                    "value": "Collected"
                                },
                                {
                                    "name": "Cancelled",
                                    "value": "Cancelled"
                                }
                            ]
                        }
                    },
                    {
                        label: "Data/time In",
                        name: "date_time",
                        filter: {
                            type: "FilterOrder"
                        }
                    },
                    {
                        label: "Est. completion",
                        name: "completion",
                        filter: {
                            type: "MultiSearch",
                            mode: "single",
                            closeDropdownOnSelection: true,
                            placeholder: "All",
                            options: [{
                                    "name": "Expiring",
                                    "value": "expiring"
                                },
                            ]
                        }
                    },
                    {
                        label: "Data/time out",
                        name: "date_time_out",
                        // filter: {
                        //     type: "FilterOrder"
                        // }
                    },
                    {
                        label: "Name",
                        name: "name",
                        // filter: {
                        //     type: "FilterOrder"
                        // }
                    },
                    {
                        label: "Company",
                        name: "company",
                        // filter: {
                        //     type: "FilterOrder"
                        // }
                    },
                    {
                        label: "",
                        name: "payment_icon",
                        class: "hidden",
                    },
                    {
                        label: "Payment",
                        name: "payment",
                        colspan: 2,
                        numberCol: 2,
                        filterSub: {
                            sub: 'method',
                            type: "MultiSearch",
                            mode: "single",
                            closeDropdownOnSelection: true,
                            placeholder: "All",
                            options: [{
                                    "name": "Paid",
                                    "value": "paid"
                                },
                                {
                                    "name": "Pending",
                                    "value": "pendding"
                                },
                                {
                                    "name": "Cancelled",
                                    "value": "cancelled"
                                },
                            ]
                        },
                        filter: {
                            type: "MultiSearch",
                            mode: "single",
                            closeDropdownOnSelection: true,
                            placeholder: "All",
                            options: [{
                                    "name": "Paypal",
                                    "value": "paypal"
                                },
                                {
                                    "name": "RS Payment",
                                    "value": "cod"
                                },
                                {
                                    "name": "PayNow",
                                    "value": "omise_paynow"
                                }
                            ]
                        }      
                    },
                    {
                        label: "Delivery",
                        name: "delivery_method",
                        colspan: 2,
                        filter: {
                            type: "MultiSearch",
                            mode: "single",
                            closeDropdownOnSelection: true,
                            placeholder: "All",
                            options: []
                        }   
                    },
                    {
                        label: "",
                        name: "delivery_address",
                        class: "hidden",
                    },
                ],
                config: {
                    checkbox_rows: true,
                    rows_selectable: false,
                    pagination_info: false,
                    card_title: "Order Dashboard",
                    per_page_options:  [10,  20,  50,  100],
                    per_page: 25,
                    page_current: 1,
                    url: 'https://botaksign.com/',
                    consumerKey: 'ck_06b92636a8d2d2bf1f0328d624b18b1c3a6b9638',
                    consumerSecret: 'cs_25e85f8fe5adad59c529a801242b9a427aa4d512',
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
                showLoader:false,
                showModalSpecialist: false,
                showModalArtWork: false,
                showModalRePrint: false,
                showModalOrderLog: false,
                showModalOrderDetail: false,
                showModalListDownLoad: false,
                ModelOrderLogId: '',
                ModelIndex: '',

            }
        },
        created () {
            var self = this;
            eventBus.$on('orderUpdate', (items) => {
                this.rows = items
            })
            eventBus.$on('multiSearch', (items) => {
                this.rows = items
            })
            // this.$root.$on('refreshBoard', function(status) {
            //     if(status == true) self.initOrder();
            // });
        }, 
        mounted: function() {
            this.initOrder();
        },
        methods: {
            initOrder: function () {
                this.showLoader = true;
                var specialist_linking = jQuery("#specialist-linking").val();
                var self = this;
                var WooCommerce = new WooCommerceRestApi({
                    url: self.config.url,
                    consumerKey: self.config.consumerKey,
                    consumerSecret: self.config.consumerSecret,
                    wpAPI: true,
                    version: 'wc/v3',
                });
                var specialist = '';
                var orders = [];
                let item = '';
                let items = [];
                var optionsSearch = {};
                
                if (specialist_linking) {
                    specialist = specialist_linking;
                }
                optionsSearch.per_page = self.config.per_page;
                optionsSearch.page = self.config.page_current ? self.config.page_current : 1;
                optionsSearch.specialist = specialist;
                WooCommerce.get('custom/search' , optionsSearch ).then(function(result) {
                    orders = result.data.orders;
                    if (orders == null) {   
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
                                delivery_method: value.shipping_method,
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
                        });
                        self.$root.$emit( 'boardOnWork' , true);
                        self.showLoader = false;
                    }
                    self.columns.forEach(function(value , key) {
                        if(value.name == "delivery_method" && self.columns[key].filter) {
                            var shipping_method_items= [];
                            var shipping_method_item = '';
                            result.data.shipping_method.forEach(function(v, k) {
                                shipping_method_item = {
                                    value: v,
                                    name: v,
                                }
                                shipping_method_items.push(shipping_method_item);
                            });
                            self.columns[key].filter.options = shipping_method_items;
                        }
                    })

                    self.rows = items;

                    self.$root.$on('changePerPage', function(items) {
                        self.rows = items;
                    });
                    self.$root.$on('changePage', function(items) {
                        self.rows = items;
                    });

                    //update ChilTable
                    self.$root.$on('updateOrderStatus', function(status , date_time_out , payment_status, index, user_can) {
                        self.rows[index].status = status;
                        self.rows[index].user_can = user_can;
                        self.rows[index].date_time_out = date_time_out;
                        if(payment_status) {
                            self.rows[index].payment_status = payment_status;
                        }
                    });
                    
                    self.$root.$on('updateClickOnHold', function(status , order_est , index) {
                        self.rows[index].status = status;
                        self.rows[index].completion = order_est;
                        self.rows[index].order_on_hold = '';
                    });
                    self.$root.$on('updateButtonOnHold', function(completion , item_status , item_no, index) {
                        self.rows[index].data_child.child_product[item_no -1 ].item_on_hold = '';
                        self.rows[index].data_child.child_product[item_no -1 ].item_status = item_status;
                        self.rows[index].data_child.child_product[item_no -1 ].completion = completion;
                    });

                    // update Art Work
                    self.$root.$on('updateEstCompletion', function(order_oh , item_oh, check_expiring, index) {
                        self.rows[index].order_on_hold = order_oh;
                        item_oh.forEach(function(value , key) {
                            if(self.rows[index].data_child.child_product ) {
                                self.rows[index].data_child.child_product[key].item_on_hold = value;
                            }
                        });
                        if( typeof check_expiring !== 'undefined') {
                            self.rows[index].expiring = check_expiring;
                        }
                    }); 
                    self.$root.$on('updateOrderStatusArt', function(status , index) {
                        self.rows[index].status = status;
                    });
                    self.$root.$on('updateItemStatusArt', function(item_status , index) {
                        item_status.forEach(function(value , key) {
                            if(self.rows[index].data_child.child_product) {
                                self.rows[index].data_child.child_product[key].item_status = value;
                            }
                        })
                    });

                    // update Reprint
                    self.$root.$on('updateItemRePrint', function(item_new_date, order_new_date, check_expiring, index) {
                        if( order_new_date !== '') {
                            self.rows[index].completion = order_new_date;
                        }
                        if( typeof check_expiring !== 'undefined') {
                            self.rows[index].expiring = check_expiring;
                        }
                        item_new_date.forEach(function(value , key) {
                            
                            if(self.rows[index].data_child.child_product) {
                                self.rows[index].data_child.child_product[key].completion = value;
                            }
                        });
                    });

                    // Overlay
                    self.$root.$on('activeOverlay', function(status) {
                        self.showLoader = status;
                    });

                    // update page
                    self.$root.$emit( 'getTotalRowsAfterSearch' ,  result.data.total);
                });
            },
            showOrder: function(row, show, event) {
                var user_id = jQuery("#current-user-id").val() ? jQuery("#current-user-id").val() : 0 ;
                let row_id = row.index;
                this.showLoader = false;
                this.rows[row_id].display = !this.rows[row_id].display;
                let self = this;
                var WooCommerce = new WooCommerceRestApi({
                    url: self.config.url,
                    consumerKey: self.config.consumerKey,
                    consumerSecret: self.config.consumerSecret,
                    wpAPI: true,
                    version: 'wc/v3',
                });
                let id = row.order_id;
                let item = '';
                let items = [];
                WooCommerce.get('custom/items/'+id , {user_id : user_id }).then(function(result) {
                    var orders_items = result.data;
                    var list_status = [];
                    orders_items.forEach(function(value , key) {
                        item = {
                            item_no: key+1,
                            download: value.download,
                            product: value.name,
                            qty: value.qty,
                            item_status: value.status,
                            product_time: value.production_time,
                            completion: value.date_completed,
                            date_time: value.date_out,
                            item_id: value.item_id,
                            order_id: value.order_id,
                            expiring: value.expiring,
                            item_on_hold: value.item_on_hold,
                            user_can: value.user_can,
                            // user_can: 'edit',
                        }
                        list_status = value.list_status;
                        items.push(item);
                    })
                    self.rows[row_id].data_child = {
                        child_order: 1,
                        child_product: items,
                        level: 2,
                        status: list_status,
                    }
                    self.showLoader = false;
                });
                const data = this._data.rows;
                data.forEach(function(value, key) {
                    if (typeof value.order_id != 'undefined' && value.order_id === row.order_id) {
                        data[key].show_child = show;
                    }
                    if (typeof value.child_order != 'undefined' && value.child_order === row.order_id) {
                        data[key].display = show;
                    }
                });
            },
            showArtWork: function(row, event) {
                this.showModalArtWork = true;
                this.ModelOrderId = row.order_id;
                this.RowIndex = row.index;
                this.showLoader = true;
            },
            showRePrint: function(row, event) {
                this.showModalRePrint = true;
                this.ModelOrderId = row.order_id;
                this.RowIndex = row.index;
                this.showLoader = true;
            },
            showOrderLog: function(row, event) {
                this.showModalOrderLog = true;
                this.ModelOrderId = row.order_id;
                this.showLoader = true;
            },
            showOrderDetail: function(row, event) {
                this.showModalOrderDetail = true;
                this.ModelOrderId = row.order_id;
                this.showLoader = true;
            },
            showListDownLoad: function(row, event) {
                this.showModalListDownLoad = true;
                this.ModelOrderId = row.order_id;
                this.showLoader = true;
            },

            closePopup: function() {
                this.showModalSpecialist = false;
                this.showModalArtWork = false;
                this.showModalRePrint = false;
                this.showModalOrderLog = false;
                this.showModalOrderDetail = false;
                this.showModalListDownLoad = false;
            },
            selectSpecialist: function (index, orderId, event) {
                this.showModalSpecialist = true;
                this.ModelOrderLogId = orderId;
                this.ModelIndex = index;
            },
            updatePaymentStatus: function(row) {
                let self = this;
                this.showLoader = true;
                var WooCommerce = new WooCommerceRestApi({
                    url: self.config.url,
                    consumerKey: self.config.consumerKey,
                    consumerSecret: self.config.consumerSecret,
                    wpAPI: true,
                    version: 'wc/v3',
                });
                var id = row.order_id;
                var payment_status = 'paid';
                WooCommerce.put('custom/items/'+id , {payment_status:payment_status}).then(function(result) {
                    self.rows[row.index].payment_status = result.data.payment_status;
                    self.showLoader = false;
                });

            }
        },
        components: {
            VueBootstrap4Table,
            ArtWork,
            RePrint,
            OrderLog,
            OrderDetail,
            ListDownLoad,
            WooCommerceRestApi,
            axios,
            SearchSpecialist,
            Specialist,
        }
    }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>  /* Remove scope (Global css order dashboard)*/
    #hello-world a {
        text-decoration: none!important;
    }
    #hello-world a:hover {
        color: #616161;
        text-decoration: none!important;
    }
    #hello-world button:focus, #hello-world input:focus{
        outline: none;
    }
    body, button.btn, .custom-select, input, a, select, span {
        font-size: 13px!important;
    }
    td,th, .btn-specialist, select, input {
        color: #7b7b7b!important;
    }
    button.btn.btn-grey {
        background: #BEBEBE;
        font-weight: 500;
    }
    button.btn.btn-grey:hover {
        background: #fff;
    }
    .btn-list{
        /*width: 50px;*/
        position: relative;
    }
    .bg-red {
        color: #fff!important;
        background: #f00;
        font-weight: 700;
    }
    a:hover {
     text-decoration: none;
    }
    .order-list{
        position: absolute;
        z-index: 100;
        margin-top:5px;
        margin-left: 10px;
        border: 1px solid black;
        padding-left: 0px;
        background-color: white;
        padding-left: 5px;
    }
    .order-list li {
        list-style-type: none;
        text-align: left;
        margin-top: 5px;
    }
    .list-select {
    margin-left: 5px;
    }
    .btn-order-file {
        white-space: nowrap;
    }

    /* Custom layout */
    /* Show order btn */
    .table td {
        vertical-align: middle;
    }
    button.btn-show-order {
        border: none;
        width: 35px;
        height: 35px;
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
    }
    /* Download file btn */
    a.btn-download-file {
        box-shadow: 0 0 3px #8f8a8a;
        padding: 5px 20px;
        border-radius: 3px;
        color: #706e72;
        background: #fff;
    }
    a.btn-download-file-error {
        background: #d1d1d1;
    }
    /* Order details dropdown */
    .order-detail-list .dropdown-menu .dropdown-item {
        display: flex;
        align-items: center;
    }
    .order-detail-list .dropdown-menu .dropdown-item a {
        color: #333;
        font-size: 13px;
    }
    .order-detail-list .dropdown-menu .dropdown-item.cs-order-detail,
    .order-detail-list .dropdown-menu .dropdown-item.cs-invoice,
    .order-detail-list .dropdown-menu .dropdown-item.cs-error,
    .order-detail-list .dropdown-menu .dropdown-item.cs-artwork,
    .order-detail-list .dropdown-menu .dropdown-item.cs-order-log {
        padding-left: 20px;
    }
    .order-detail-list .dropdown-menu .dropdown-item.cs-order-detail svg,
    .order-detail-list .dropdown-menu .dropdown-item.cs-invoice svg,
    .order-detail-list .dropdown-menu .dropdown-item.cs-error svg,
    .order-detail-list .dropdown-menu .dropdown-item.cs-artwork svg,
    .order-detail-list .dropdown-menu .dropdown-item.cs-order-log svg {
        font-size: 18px;
    }
    .order-detail-list .dropdown-menu .dropdown-item.cs-error svg path {
        color: red;
    }
    .date-time-out .bi-check-circle path {
        fill: #fff;
    }
    .order-detail-list.dropdown #dropdownMenuButton {
        border: none;
        padding: 10px 20px;
        display: flex;
        align-items: center;
        color: #333333;
        background: #fff;
        box-shadow: 0 0 2px #8f8a8a;
    }
    .order-detail-list.dropdown #dropdownMenuButton:hover {
        background: transparent;
        background: #f3f3f3;
    }
    /* Status btn */
    button.btn.btn-status {
        padding: 5px 20px;
        font-size: 17px;
        font-weight: 600;
    }
    button.btn.btn-cancelled {
        background: red;
        color: #fff;
    }
    button.btn.btn-ongoing {
        background: #ff8b00;
        color: #26181b;
    }
    button.btn.btn-completed {
        color: #fff;
        background: #32cc31;
    }
    button.btn.btn-completed {
        color: #26181b;
        background: #fff200;
    }
    button.btn.btn-collected {
        color: #fff;
        background: #2957de;
    }

    /* Payment SVG */
    .bi-check-circle path {
        fill: #72c179;
    }
    .bi-clock path {
        fill: #f7983a;
    }
    .bi-slash-circle-fill path {
        fill: #f00;
    }
    button.btn-specialist {
        border-radius: 0.25rem;
        border: 1px solid #bdbdbd;
        box-shadow: none;
        white-space: nowrap;
        padding: 5px 10px;
        font-weight: 600;
        background: #fff;
        box-shadow: 0 0 2px #8f8a8a;
    }
    button.btn-specialist:hover {
        background: #f3f3f3;
        border-color: #fff;
    }
    .multiselect__tags {
        min-height: 35px!important;
        display: block;
        padding: 4px 40px 0 10px!important;
        border-radius: 5px;
        border: 1px solid #7b7b7b!important;
        background: #fff;
        font-size: 13px!important;
        box-shadow: 0 0 3px #8f8a8a!important;
    }
    .multiselect__placeholder {
        font-weight: 400;
        margin-bottom: 0!important;
    }
    .multiselect__select {
        width: 38px!important;
        height: 30px!important;
    }
    .multiselect__content .multiselect__element span {
        padding: 10px 10px!important;
        min-height: 30px;
        font-weight: 400;
    }
    .multiselect__option:hover {
        background: #9c9c9c!important;
    }
    .multiselect__option:hover span {
        color: #fff;
    }
    .multiselect__option--highlight {
         color: #fff;
          background: #9c9c9c!important;
    }
    .multiselect__option:after {
        display: none!important;
    }
    .multiselect__tags-wrap {
        display: inline-flex;
    }
    .multiselect__tags-wrap .multiselect__tag {
        background: #9c9c9c;
        margin-bottom: 0;
    }
    .multiselect__tag-icon:hover i:after {
        color: #9c9c9c;
    }
    .multiselect__tags-wrap .multiselect__tag  i:after {
        color: #fff;
    }
    .multiselect__tag-icon:hover {
        background: #fff!important;
    }
    .vbt-reset-button {
        height: 35px;
        border-radius: 0.25rem;
        border: 1px solid #7b7b7b;
        margin-left: 10px;
        background: #fff;
        color: #7b7b7b;
        padding: 1px 15px;
        box-shadow: 0 0 3px #8f8a8a;
        font-weight: 600;
    }
    .vbt-reset-button:hover {
        background: #e8e8e8;
    }
    .vbt-reset-button .icon-load {
        margin-right: 5px;
    }
    .setting-options span {
        font-weight: 300;
    }
    .setting-options input {
        border-radius: 0.25rem;
        border: 1px solid #dee2e6;
        margin-left: 10px;
        background: #fff;
        color: #9c9c9c;
        padding: 1px 10px;
        width: 70px;
    }
    .btn-status-item {
        background: #909090;
        color: #fff;
        line-height: 1.5;
        border-radius: 0.25rem;
        border: 1px  #909090 solid;
        padding: 0.375rem 0.75rem;
    }
    
</style>
