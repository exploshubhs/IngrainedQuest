import { Props, Component } from "react";
import { TypeAheadDropDown } from "components/utility/typeahead-dropdown";
import { LookUp } from "utils/lookup/index";

interface PhoneProps extends Props<PhoneMain> {
    phoneAssistant: ClientModels.Phone;
    phoneBusiness: ClientModels.Phone;
    phoneBusiness2: ClientModels.Phone;
    phoneBusinessFax: ClientModels.Phone;
    phoneCallback: ClientModels.Phone;
    phoneCar: ClientModels.Phone;
    phoneCompany: ClientModels.Phone;
    phoneHome: ClientModels.Phone;
    phoneHome2: ClientModels.Phone;
    phoneHomeFax: ClientModels.Phone;
    phoneIsdn: ClientModels.Phone;
    phoneMobile: ClientModels.Phone;
    phoneOther: ClientModels.Phone;
    phoneOtherFax: ClientModels.Phone;
    phonePager: ClientModels.Phone;
    phonePrimary: ClientModels.Phone;
    phoneRadio: ClientModels.Phone;
    phoneTelex: ClientModels.Phone;
    phoneTty: ClientModels.Phone;

    isEditMode?: boolean;
    headerVisible?: boolean;
    isAdviserSidebar?: boolean;
    onPhoneTextChange?: (type: string, obj: ClientModels.Phone[]) => any;
    onPhoneClick?: () => any;
}

interface PhoneState {
    phones?: any;
    phonesCopy?: any;
    duplicatePhone?: boolean;
    warningText?: string;
    isMobile?: boolean;
}

const getPhoneNumber = (phone): string => {
    let phoneNumber = "+";
    if (phone.dialingCode) {
        phoneNumber += phone.dialingCode;
    }
    if (phone.cityCode) {
        phoneNumber += " (" + phone.cityCode + ")";
    }
    if (phone.phoneNumber) {
        phoneNumber += " " + phone.phoneNumber;
    }
    if (phone.extension) {
        phoneNumber += " " + phone.extension;
    }
    return phoneNumber;
};

const getTelPhoneNumber = (phone): string => {
    return `tel:${phone.dialingCode || 1}-${phone.cityCode}-${phone.phoneNumber}`;
};

export class PhoneMain extends Component<PhoneProps, PhoneState> {

    constructor(props) {
        super(props);
        this.onPhoneClick = this.onPhoneClick.bind(this);
        this.onAddPhone = this.onAddPhone.bind(this);
        this.onHandleNewNumberChange = this.onHandleNewNumberChange.bind(this);
        this.onChangeType = this.onChangeType.bind(this);

        this.state = {
            phones : this.setPhoneValues(this.props),
            phonesCopy : [],
            duplicatePhone: false,
            warningText: null,
            isMobile: $("html").hasClass("ismobile"),
        };

        this.state.phonesCopy = [].concat(this.state.phones);
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.isEditMode) {
            let phones = this.setPhoneValues(nextProps);
            this.setState({phones: phones, duplicatePhone: false, warningText: null});
        }
    }

    setPhoneValues(nextProps) {
        let phones = [];
        const {phoneAssistant, phoneBusiness, phoneBusiness2, phoneBusinessFax,
            phoneCallback, phoneCar, phoneCompany, phoneHome, phoneHome2,
            phoneHomeFax, phoneIsdn, phoneMobile, phoneOther, phoneOtherFax,
            phonePager, phonePrimary, phoneRadio, phoneTelex, phoneTty, isAdviserSidebar} = nextProps;
        if (phoneAssistant) {
            if (phoneAssistant.dialingCode || phoneAssistant.cityCode || phoneAssistant.extension
                || phoneAssistant.phoneNumber) {
                phones.push({"PhoneAssistant": _.extend({}, phoneAssistant)});
            }
        }
        if (phoneBusiness) {
            if (phoneBusiness.dialingCode || phoneBusiness.cityCode || phoneBusiness.extension
                || phoneBusiness.phoneNumber) {
                phones.push({"PhoneBusiness": _.extend({}, phoneBusiness)});
            }
        }
        if (phoneBusiness2) {
            if (phoneBusiness2.dialingCode || phoneBusiness2.cityCode || phoneBusiness2.extension
                || phoneBusiness2.phoneNumber) {
                phones.push({"PhoneBusiness2": _.extend({}, phoneBusiness2)});
            }
        }
        if (phoneBusinessFax) {
            if (phoneBusinessFax.dialingCode || phoneBusinessFax.cityCode || phoneBusinessFax.extension
                || phoneBusinessFax.phoneNumber) {
                phones.push({"PhoneBusinessFax": _.extend({}, phoneBusinessFax)});
            }
        }
        if (phoneCallback) {
            if (phoneCallback.dialingCode || phoneCallback.cityCode || phoneCallback.extension
                || phoneCallback.phoneNumber) {
                phones.push({"PhoneCallback": _.extend({}, phoneCallback)});
            }
        }
        if (phoneCar) {
            if (phoneCar.dialingCode || phoneCar.cityCode || phoneCar.extension || phoneCar.phoneNumber) {
                phones.push({"PhoneCar": _.extend({}, phoneCar)});
            }
        }
        if (phoneCompany) {
            if (phoneCompany.dialingCode || phoneCompany.cityCode || phoneCompany.extension
                || phoneCompany.phoneNumber) {
                phones.push({"PhoneCompany": _.extend({}, phoneCompany)});
            }
        }
        if (!isAdviserSidebar) {
            if (phoneHome) {
                if (phoneHome.dialingCode || phoneHome.cityCode || phoneHome.extension || phoneHome.phoneNumber) {
                    phones.push({"PhoneHome": _.extend({}, phoneHome)});
                }
            }
            if (phoneHome2) {
                if (phoneHome2.dialingCode || phoneHome2.cityCode || phoneHome2.extension || phoneHome2.phoneNumber) {
                    phones.push({"PhoneHome2": _.extend({}, phoneHome2)});
                }
            }
            if (phoneHomeFax) {
                if (phoneHomeFax.dialingCode || phoneHomeFax.cityCode || phoneHomeFax.extension
                    || phoneHomeFax.phoneNumber) {
                    phones.push({"PhoneHomeFax": _.extend({}, phoneHomeFax)});
                }
            }
        }
        if (phoneIsdn) {
            if (phoneIsdn.dialingCode || phoneIsdn.cityCode || phoneIsdn.extension || phoneIsdn.phoneNumber) {
                phones.push({"PhoneIsdn": _.extend({}, phoneIsdn)});
            }
        }
        if (phoneMobile) {
            if (phoneMobile.dialingCode || phoneMobile.cityCode || phoneMobile.extension || phoneMobile.phoneNumber) {
                phones.push({"PhoneMobile": _.extend({}, phoneMobile)});
            }
        }
        if (phoneOther) {
            if (phoneOther.dialingCode || phoneOther.cityCode || phoneOther.extension || phoneOther.phoneNumber) {
                phones.push({"PhoneOther": _.extend({}, phoneOther)});
            }
        }
        if (phoneOtherFax) {
            if (phoneOtherFax.dialingCode || phoneOtherFax.cityCode || phoneOtherFax.extension
                || phoneOtherFax.phoneNumber) {
                phones.push({"PhoneOtherFax": _.extend({}, phoneOtherFax)});
            }
        }
        if (phonePager) {
            if (phonePager.dialingCode || phonePager.cityCode || phonePager.extension || phonePager.phoneNumber) {
                phones.push({"PhonePager": _.extend({}, phonePager)});
            }
        }
        if (phonePrimary) {
            if (phonePrimary.dialingCode || phonePrimary.cityCode || phonePrimary.extension
                || phonePrimary.phoneNumber) {
                phones.push({"PhonePrimary": _.extend({}, phonePrimary)});
            }
        }
        if (phoneRadio) {
            if (phoneRadio.dialingCode || phoneRadio.cityCode || phoneRadio.extension || phoneRadio.phoneNumber) {
                phones.push({"PhoneRadio": _.extend({}, phoneRadio)});
            }
        }
        if (phoneTelex) {
            if (phoneTelex.dialingCode || phoneTelex.cityCode || phoneTelex.extension || phoneTelex.phoneNumber) {
                phones.push({"PhoneTelex": _.extend({}, phoneTelex)});
            }
        }
        if (phoneTty) {
            if (phoneTty.dialingCode || phoneTty.cityCode || phoneTty.extension || phoneTty.phoneNumber) {
                phones.push({"PhoneTTY": _.extend({}, phoneTty)});
            }
        }
        return phones;
    }

    onHandleNewNumberChange(i, key, props, field, e) {
        props[i][key][field] = e.target.value;
        this.setState({phones: props});
        this.props.onPhoneTextChange("changed", this.state.phones);
    }

    onPhoneClick(index, id) {
        const { onPhoneClick } = this.props;
        const phone = getPhoneNumber(this.state.phones[index][id]);
        if (phone) {
            if (onPhoneClick) {
                onPhoneClick();
            }
            window.open("tel:" + phone);
        }
    }

    onMessageClick(index, id) {
        let phone = this.state.phones[index][id];
        if (phone) {
            phone = `${phone.dialingCode || 1}-${phone.cityCode}-${phone.phoneNumber}`;
            window.open("sms:" + phone);
        }
    }

    onAddPhone() {
        let allKeys = [];
        this.state.phones.map((phones) => {
            let keys = Object.keys(phones);
            allKeys.push(keys[0]);
        });

        let key = "";
        if (allKeys.indexOf("PhoneAssistant") === -1) {
            key = "PhoneAssistant";
        } else if (allKeys.indexOf("PhoneBusiness") === -1) {
            key = "PhoneBusiness";
        } else if (allKeys.indexOf("PhoneBusiness2") === -1) {
            key = "PhoneBusiness2";
        } else if (allKeys.indexOf("PhoneBusinessFax") === -1) {
            key = "PhoneBusinessFax";
        } else if (allKeys.indexOf("PhoneCallback") === -1) {
            key = "PhoneCallback";
        } else if (allKeys.indexOf("PhoneCar") === -1) {
            key = "PhoneCar";
        } else if (allKeys.indexOf("PhoneCompany") === -1) {
            key = "PhoneCompany";
        } else if (allKeys.indexOf("PhoneHome") === -1) {
            key = "PhoneHome";
        } else if (allKeys.indexOf("PhoneHome2") === -1) {
            key = "PhoneHome2";
        } else if (allKeys.indexOf("PhoneHomeFax") === -1) {
            key = "PhoneHomeFax";
        } else if (allKeys.indexOf("PhoneIsdn") === -1) {
            key = "PhoneIsdn";
        } else if (allKeys.indexOf("PhoneMobile") === -1) {
            key = "PhoneMobile";
        } else if (allKeys.indexOf("PhoneOther") === -1) {
            key = "PhoneOther";
        } else if (allKeys.indexOf("PhoneOtherFax") === -1) {
            key = "PhoneOtherFax";
        } else if (allKeys.indexOf("PhonePager") === -1) {
            key = "PhonePager";
        } else if (allKeys.indexOf("PhonePrimary") === -1) {
            key = "PhonePrimary";
        } else if (allKeys.indexOf("PhoneRadio") === -1) {
            key = "PhoneRadio";
        } else if (allKeys.indexOf("PhoneTelex") === -1) {
            key = "PhoneTelex";
        } else if (allKeys.indexOf("PhoneTTY") === -1) {
            key = "PhoneTTY";
        }

        this.onChangeType(this.state.phones.length, key, key);
    }

    componentDidMount() {
        this.props.onPhoneTextChange("mount", this.state.phones);
    }

    onDeletePhone(index) {
        let phones = this.state.phones.slice();
        phones.splice(index, 1);
        this.setState({phones: phones, duplicatePhone: false, warningText: null});
        this.props.onPhoneTextChange("delete", phones);
    }

    onChangeType(index, id, type) {

        let obj = {};
        obj[id] = {
            dialingCode: "",
            cityCode: "",
            phoneNumber: "",
            extension: "",
        };
        this.state.phonesCopy.map((phone) => {
            let keys = Object.keys(phone);
            let key = keys[0];
            if (key === id) {
                obj[id] = {
                    dialingCode: phone[id].dialingCode,
                    cityCode: phone[id].cityCode,
                    phoneNumber: phone[id].phoneNumber,
                    extension: phone[id].extension,
                };
            }
        });
        this.state.phones.splice(index, 1);
        this.state.phones.splice(index, 0, obj);
        this.setState({phones: this.state.phones, duplicatePhone: false, warningText: null});
        this.props.onPhoneTextChange("change", this.state.phones);
    }

    componentDidUpdate() {
        let phoneKeys = [];

        this.state.phones.map((phone) => {
            let keys = Object.keys(phone);
            phoneKeys.push(keys[0]);
        });

        let key = "";

        let isDuplicatePhone = phoneKeys.some((item, idx) => {
            key =  item;
            return phoneKeys.indexOf(item) !== idx;
        });

        if (isDuplicatePhone !== this.state.duplicatePhone) {
            this.setState({duplicatePhone: true});
            this.setState({warningText: "Duplicate " + key + " selected."});
        }
    }

    render() {
        const { isEditMode, headerVisible, isAdviserSidebar } = this.props;
        const { phones, duplicatePhone, warningText } = this.state;

        return (
            <div className="row">
                {headerVisible && (phones.length > 0 || isEditMode) &&
                    <div className="card-header">
                        <h2><i className="zmdi zmdi-phone m-r-15" />Phone Numbers</h2>
                    </div>
                }
                <div className={"col-sm-12" + (!isEditMode ? "" : " pr-0")}>
                    {isEditMode && phones.map((phone, i,props) => {
                        let keys = Object.keys(phone);
                        let key = keys[0];
                        phone = phone[key];
                        return (
                        <div key={i} className="col-xs-12 pr-0">
                            <div className="col-sm-4 pl-0">
                                <div className="input-group fg-float">
                                    <span className="input-group-addon">
                                        <i className="zmdi zmdi-phone" />
                                    </span>
                                    <div className={"fg-line " + (phone ? "fg-toggled" : "")}>
                                        <TypeAheadDropDown
                                            onSelectionChanged={(id, type) => { this.onChangeType(i, id, type); } }
                                            lookUp={LookUp.PhoneType} defaultSelection={key} selection={key}/>
                                        <label className="fg-label" id="new_phone_type_label">Type</label>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-8 pr-0">
                                <div className="col-sm-2 p-l-0 p-r-10">
                                    <div className="form-group fg-float pl-30">
                                        <div className={"fg-line" + (phone.dialingCode ? " fg-toggled" : "") }>
                                            <input type="text" className="form-control" id="phone_dialingcode_field"
                                                   value={phone.dialingCode || ""}
                                                   onChange={this.onHandleNewNumberChange.bind(
                                                             this, i, key, props, "dialingCode")}
                                            />
                                            <label className="fg-label" id="phone_dialingcode_label">X</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-2 p-l-0 p-r-10">
                                    <div className="form-group fg-float pl-30">
                                        <div className={"fg-line" + (phone.cityCode ? " fg-toggled" : "") }>
                                            <input type="text" className="form-control" id="phone_citycode_field"
                                                   value={phone.cityCode || ""}
                                                   onChange={this.onHandleNewNumberChange.bind(
                                                             this, i, key, props, "cityCode")}
                                            />
                                            <label className="fg-label" id="phone_citycode_label">XXX</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-4 p-l-0 p-r-10">
                                    <div className="form-group fg-float pl-30">
                                        <div className={"fg-line " + (phone.phoneNumber ? "fg-toggled" : "") }>
                                            <input type="text" className="form-control" id="new_phone_field"
                                                   value={phone.phoneNumber}
                                                   onChange={this.onHandleNewNumberChange.bind(
                                                             this, i, key, props,"phoneNumber")}
                                            />
                                            <label className="fg-label" id="new_phone_label">XXX-XXXX</label>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-sm-4 p-l-0 p-r-10">
                                    <div className="input-group fg-float pl-30">
                                        <div className={"fg-line" + (phone.extension ? " fg-toggled" : "") }>
                                            <input type="text" className="form-control" id="phone_extention_field"
                                                   value={phone.extension || ""}
                                                   onChange={this.onHandleNewNumberChange.bind(
                                                             this, i, key, props, "extension")}
                                            />
                                            <label className="fg-label" id="address_extention_label">XXX</label>
                                        </div>
                                        <span className="input-group-addon" style={{textAlign:"right"}}>
                                            <i className="zmdi zmdi-close clickable"
                                               onClick={e => this.onDeletePhone(i)} />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                            );
                        })}

                    {!isEditMode && phones.map((phone, i,props) => {
                        let keys = Object.keys(phone);
                        let key = keys[0];
                        phone = phone[key];
                        return (
                            isAdviserSidebar ?
                            <div key={i} className="m-b-5">
                                <div style={{display: "table", width: "100%"}}>
                                    <div style={{display: "table-row"}}>
                                        <div style={{display: "table-cell", verticalAlign: "top"}}>
                                            <a
                                                href={getTelPhoneNumber(phone)}
                                                className="m-r-10"
                                                style={{textDecoration: "none", color: "#5e5e5e"}}
                                            >
                                                <i className="zmdi zmdi-phone" />
                                            </a>
                                        </div>
                                        <div style={{display: "table-cell", verticalAlign: "top", width: "90%"}}>
                                            <div style={{display: "block"}}>
                                                <a
                                                    href={getTelPhoneNumber(phone)}
                                                    className="adviser-anchor-text"
                                                >
                                                    <strong>{getPhoneNumber(phone)}</strong>
                                                </a>
                                            </div>
                                            <div>
                                                <small>
                                                    {key.replace("Phone", "").replace(/([A-Z][a-z])/g, " $1")}
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            :
                            <div className={"col-sm-12 pr-0 " +
                                            (!phone.phoneNumber && !phone.dialingCode && !phone.cityCode &&
                                                !phone.extension ? "hidden" : "show")}
                                 key={i}>
                                <div className="input-group fg-float">
                                    <span
                                        className="input-group-addon clickable"
                                        onClick={e => this.onPhoneClick(i, key)}
                                    >
                                        <i className="zmdi zmdi-phone" style={{zIndex: 9}} />
                                    </span>
                                    <div className={"fg-line read-only-mode " + (phone ? "fg-toggled" : "") }>
                                        <input type="text" className="form-control" id="new_phone_field"
                                               value={getPhoneNumber(phone)}
                                               readOnly
                                        />
                                        <label className="fg-label" id="new_phone_label">
                                            {key.replace(/([A-Z]+)/g, " $1").replace(/([A-Z][a-z])/g, " $1")}
                                        </label>
                                    </div>
                                    {this.state.isMobile &&
                                        <span className="input-group-addon" style={{textAlign:"right"}}>
                                            <i className="zmdi zmdi-comment-text clickable"
                                               style={{zIndex: 9}}
                                               onClick={e => this.onMessageClick(i, key)}>
                                            </i>
                                        </span>
                                    }
                                </div>
                            </div>
                            );
                        })}
                </div>

                <div className={"col-sm-12 m-b-15 " +
                                (!isEditMode ? "hidden" : "show ") + (phones.length === 0 ? "m-t-25" : "")}>
                    <div className={"form-group has-error " + (duplicatePhone && isEditMode ? "show" : "hidden")}>
                        <label className="help-block p-l-15 m-l-30">
                            {warningText}
                        </label>
                    </div>

                    <div className={"btn-demo p-l-15 m-l-30 " + (!isEditMode ? "hidden" : "show") }>
                        <button className="btn btn-primary" onClick={this.onAddPhone} disabled={phones.length >= 19}>
                            Add Phone
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
