import { Props, Component } from "react";
import { TypeAheadDropDown } from "components/utility/typeahead-dropdown";
import { LookUp } from "utils/lookup/index";
import { TextAreaInputFloating } from "components/utility/theme/text-area-input-floating";

interface AddressProps extends Props<AddressMain> {
    addressHome: ClientModels.Address;
    addressBusiness: ClientModels.Address;
    addressOther: ClientModels.Address;
    isEditMode?: boolean;
    headerVisible?: boolean;
    isAdviserSidebar?: boolean;
    onAddressTextChange?: (type: string, obj: ClientModels.Address[]) => any;
}

interface AddressState {
    add?: any;
    address?: any;
    duplicateAddress?: boolean;
    warningText?: string;
}

export class AddressMain extends Component<AddressProps, AddressState> {
    addressInput: TextAreaInputFloating;
    constructor(props) {
        super(props);
        this.state = {
            add : this.setAddressValues(this.props),
            address: [],
            duplicateAddress: false,
            warningText: null,
        };

        this.state.address = [].concat(this.state.add);
        this.onAddAddress = this.onAddAddress.bind(this);
        this.onDeleteAddress = this.onDeleteAddress.bind(this);
        this.onChangeType = this.onChangeType.bind(this);
        this.onHandleAddressChange = this.onHandleAddressChange.bind(this);
        this.onMailingAddressClick = this.onMailingAddressClick.bind(this);
    }

    componentDidMount() {
        this.props.onAddressTextChange("mount", this.state.add);
    }

    componentDidUpdate() {
        let addressKeys = [];
        let key = "";

        this.state.add.map((address) => {
            let keys = Object.keys(address);
            addressKeys.push(keys[0]);
        });

        let isDuplicateAddress = addressKeys.some((item, idx) => {
            key =  item;
            return addressKeys.indexOf(item) !== idx;
        });

        if (isDuplicateAddress !== this.state.duplicateAddress) {
            this.setState({duplicateAddress: true});
            this.setState({warningText: "Duplicate " + key + " selected."});
        }
    }

    componentWillReceiveProps(nextProps) {
         if (!nextProps.isEditMode) {
             let address = this.setAddressValues(nextProps);
             this.setState({add : address, duplicateAddress: false, warningText: null});
         }
    }

    setAddressValues(nextProps) {
        let address = [];
        const {addressHome, addressBusiness, addressOther} = nextProps;
        if (addressHome) {
            if (addressHome.address1 || addressHome.address2 || addressHome.city ||
                addressHome.state || addressHome.zip || addressHome.country) {
                address.push({"Home": _.extend({}, addressHome)});
            }
        }
        if (addressBusiness) {
            if (addressBusiness.address1 || addressBusiness.address2 || addressBusiness.city ||
                addressBusiness.state || addressBusiness.zip || addressBusiness.country) {
                address.push({"Business": _.extend({}, addressBusiness)});
            }
        }
        if (addressOther) {
            if (addressOther.address1 || addressOther.address2 || addressOther.city
                || addressOther.state || addressOther.zip || addressOther.country) {
                address.push({"Other": _.extend({}, addressOther)});
            }
        }
        return address;
    }

    onDeleteAddress(index) {
        let address = this.state.add.slice();
        address.splice(index, 1);
        this.setState({add: address, duplicateAddress: false, warningText: null});
        this.props.onAddressTextChange("delete", address);
    }

    onHandleAddressChange(i, id, props, field, e ) {
        props[i][id][field] = e.target.value;
        this.setState({add : props});
        this.props.onAddressTextChange("new", props);
    }

    onMailingAddressClick (i, id, props, field, e) {
        this.state.add.map((address, j) => {
            let keys = Object.keys(address);
            let key = keys[0];
            props[j][key][field] = !e.target.checked;
        });
        props[i][id][field] = e.target.checked;
        this.setState({add : props, address: props});
        this.props.onAddressTextChange("new", props);
    }

    getFullAddress(address) {
        let fullAddress = "";
        if (address.address1) {
            fullAddress += address.address1;
        }
        if (address.address2) {
            fullAddress += " \n" + address.address2;
        }
        if (address.city) {
            fullAddress += " \n" + address.city;
        }
        if (address.state) {
            fullAddress += ", " + address.state;
        }
        if (address.zip) {
            fullAddress += ", " + address.zip;
        }
        if (address.country) {
            fullAddress += " \n" + address.country;
        }

        return fullAddress.trim();
    }

    onAddressClick = (address) => (e?: __React.MouseEvent) => {
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }
        if (address) {
            window.open("http://maps.google.com?q=" + address);
        }
    };

    onAddressTextClick = (address) => (text: string) => {
        if (address) {
            window.open("http://maps.google.com?q=" + address);
        }
    };

    onChangeType(index, id, type) {
        let obj = {};
        obj[id] = {
            address1: "",
            address2: "",
            city: "",
            state: "",
            zip: "",
            country: "",
            isMailing: false,
        };
        this.state.address.map((addr, i) => {
            let keys = Object.keys(addr);
            let key = keys[0];
            if (key === id) {
                obj[id] = {
                    address1: addr[id].address1,
                    address2: addr[id].address2,
                    city: addr[id].city,
                    state: addr[id].state,
                    zip: addr[id].zip,
                    country: addr[id].country,
                    isMailing: addr[id].isMailing,
                };
            }
        });
        let address = this.state.add.slice();
        address.splice(index, 1);
        address.splice(index, 0, obj);
        this.setState({add: address, duplicateAddress: false, warningText: null});
        this.props.onAddressTextChange("change", address);
    }

    onAddAddress() {

        let allKeys = [];
        let key = "";

        this.state.add.map((address) => {
            let keys = Object.keys(address);
            allKeys.push(keys[0]);
        });

        if (allKeys.indexOf("Home") === -1) {
            key = "Home";
        }else if (allKeys.indexOf("Business") === -1) {
            key = "Business";
        }else if (allKeys.indexOf("Other") === -1) {
            key = "Other";
        }

        this.onChangeType(this.state.add.length, key, key);
    }

    render() {
        const { isEditMode, headerVisible, isAdviserSidebar } = this.props;
        const { add, duplicateAddress, warningText } = this.state;

        return (
            <div className="row">
                {headerVisible && (add.length > 0  || isEditMode) &&
                    <div className="card-header">
                        <h2><i className="zmdi zmdi-home m-r-15"/>Address</h2>
                    </div>
                }
                <div className={"col-sm-12 " + (isEditMode ? " pr-0" : "")}>
                    {isEditMode && (add.map((address, i,props) => {
                        let keys = Object.keys(address);
                        let key = keys[0];
                        address = address[key];
                        return (
                            <div key={i}>
                                <div className="col-sm-4">
                                    <div className="input-group fg-float" style={{marginBottom : "0px"}}>
                                        <span className="input-group-addon">
                                            <i className="zmdi zmdi-home"/>
                                        </span>
                                        <div className={"fg-line" + (address ? " fg-toggled" : "") }>
                                            <TypeAheadDropDown
                                                onSelectionChanged={(id, type) => { this.onChangeType(i, id, type); } }
                                                defaultSelection={key}
                                                selection={key}
                                                placeHolderOverride = " "
                                                lookUp={LookUp.Address}/>
                                            <label className="fg-label" id="address_type_label">Type</label>
                                        </div>
                                    </div>

                                    <div className="checkbox" style={{marginBottom : "30px"}}>
                                        <label htmlFor="address_mailing_address_field" >Mailing Address</label>
                                        <input id="address_mailing_address_field"
                                               type="checkbox"
                                               onChange={this.onMailingAddressClick.bind(this,
                                                    i, key, props, "isMailing")}
                                               checked={address.isMailing}/>
                                        <i className="input-helper"/>
                                    </div>
                                </div>
                                <div className={"col-sm-8 " + (isEditMode ? " pr-0" : "")}>
                                    <div className="input-group fg-float pl-30">
                                        <div className={"fg-line" + (address.address1 ? " fg-toggled" : "") }>
                                            <input type="text"
                                                   id="address_address1_field"
                                                   className="form-control fg-input"
                                                   onChange={this.onHandleAddressChange.bind(this,
                                                            i, key, props, "address1")}
                                                   value={address.address1 || ""}
                                            />
                                            <label htmlFor="address_address1_field" className="fg-label">
                                                Address1
                                            </label>
                                        </div>
                                        <span className="input-group-addon" style={{textAlign:"right"}}>
                                            <i className="zmdi zmdi-close clickable"
                                               onClick={e => this.onDeleteAddress(i)} />
                                        </span>
                                    </div>

                                    <div className="input-group fg-float pl-30">
                                        <div className={"fg-line" + (address.address2 ? " fg-toggled" : "") }>
                                            <input type="text"
                                                   id="address_address2_field"
                                                   className="form-control fg-input"
                                                   onChange={this.onHandleAddressChange.bind(this,
                                                            i, key, props, "address2")}
                                                   value={address.address2 || ""}
                                            />
                                            <label htmlFor="address_address2_field" className="fg-label">
                                                Address2
                                            </label>
                                        </div>
                                        <span className="input-group-addon"/>
                                    </div>

                                    <div className="col-sm-6 p-l-0 p-r-10">
                                        <div className="form-group fg-float pl-30">
                                            <div className={"fg-line" + (address.city ? " fg-toggled" : "") }>
                                                <input type="text"
                                                       id="address_city_field"
                                                       className="form-control fg-input"
                                                       onChange={this.onHandleAddressChange.bind(this,
                                                                i, key, props, "city")}
                                                       value={address.city || ""}
                                                />
                                                <label htmlFor="address_city_field" className="fg-label">City</label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-sm-2 p-l-0 p-r-10">
                                        <div className="form-group fg-float pl-30">
                                            <div className={"fg-line" + (address.state ? " fg-toggled" : "") }>
                                                <input type="text"
                                                       id="address_state_field"
                                                       className="form-control fg-input"
                                                       onChange={this.onHandleAddressChange.bind(this,
                                                            i, key, props, "state")}
                                                       value={address.state || ""}
                                                />
                                                <label htmlFor="address_state_field" className="fg-label">State</label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-sm-4 p-l-0 p-r-0">
                                        <div className="input-group fg-float pl-30">
                                            <div className={"fg-line" + (address.zip ? " fg-toggled" : "") }>
                                                <input type="text"
                                                       id="address_zip_field"
                                                       className="form-control fg-input"
                                                       onChange={this.onHandleAddressChange.bind(this,
                                                            i, key, props, "zip")}
                                                       value={address.zip || ""}
                                                />
                                                <label htmlFor="address_zip_field" className="fg-label">Zip</label>
                                            </div>
                                            <span className="input-group-addon"/>
                                        </div>
                                    </div>

                                    <div className="col-sm-12 p-l-0 p-r-0">
                                        <div className="input-group fg-float pl-30">
                                            <div className={"fg-line" + (address.country ? " fg-toggled" : "") }>
                                                <input type="text"
                                                       id="address_country_field"
                                                       className="form-control fg-input"
                                                       onChange={this.onHandleAddressChange.bind(this,
                                                                i, key, props, "country")}
                                                       value={address.country || ""}
                                                />
                                                <label htmlFor="address_country_field" className="fg-label">
                                                    Country
                                                </label>
                                            </div>
                                            <span className="input-group-addon"/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    }))
                    }

                    {!isEditMode && add.map(((address, i,props) => {
                        let keys = Object.keys(address);
                        let key = keys[0];
                        address = address[key];
                        return(
                            isAdviserSidebar ?
                            <div key={i} style={{whiteSpace: "pre"}}>
                                <div style={{display: "table"}}>
                                    <div style={{display: "table-row"}}>
                                        <div style={{display: "table-cell", verticalAlign: "top"}}>
                                            <span style={{marginRight: "5px"}}>
                                                <i
                                                    className="zmdi zmdi-home clickable"
                                                    onClick={this.onAddressClick(this.getFullAddress(address))}
                                                />
                                            </span>
                                        </div>
                                        <div style={{display: "table-cell", width: "90%", verticalAlign: "top"}}>
                                            <a
                                                href=""
                                                onClick={this.onAddressClick(this.getFullAddress(address))}
                                                className="adviser-anchor-text"
                                            >
                                                <span>{this.getFullAddress(address)}</span>
                                            </a>

                                        </div>
                                    </div>
                                </div>
                            </div>
                            :
                            <div key={i + this.getFullAddress(address)}
                                 className={"col-sm-12 pr-0 " +
                                 (!address.address1 && !address.address2 && !address.city &&
                                 !address.state && !address.zip && !address.country ? "hidden" : "show")}>
                                <div className="input-group fg-float">
                                    <span className="input-group-addon clickable">
                                        <i className="zmdi zmdi-home"
                                           onClick={this.onAddressClick(this.getFullAddress(address))}/>
                                    </span>
                                    <TextAreaInputFloating
                                        inputClassName="clickable"
                                        ref={(addressInput) => this.addressInput = (addressInput)}
                                        labelText={key}
                                        isEditMode={false}
                                        initialText={this.getFullAddress(address)}
                                        onTextClick={this.onAddressTextClick(this.getFullAddress(address))}
                                        suppressTopMargin
                                    />
                                </div>
                            </div>
                        );
                    }))}
                </div>

                <div className={"col-sm-12 m-b-15 " +
                    (!isEditMode ? "hidden " : "show ") +
                    (add.length === 0 ? "m-t-25" : "") }>
                    <div className={"form-group has-error " +
                        (duplicateAddress && isEditMode ? "show" : "hidden")}>
                        <label className="help-block p-l-15 m-l-30">
                            {warningText}
                        </label>
                    </div>
                    <div className={"btn-demo p-l-15 m-l-30 " + (!isEditMode ? "hidden" : "show") }>
                        <button className="btn btn-primary" onClick={this.onAddAddress} disabled={add.length >= 3}>
                            Add Address
                        </button>
                    </div>
                </div>

            </div>
        );
    }
}
