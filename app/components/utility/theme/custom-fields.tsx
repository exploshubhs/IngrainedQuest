import { Props, Component } from "react";
import { TextInputFloating } from "components/utility/theme/text-input-floating";
import { TextInputDatePicker } from "components/utility/theme/text-input-date-picker";
import { CheckboxInput } from "components/utility/theme/checkbox-input";
import { TypeAheadDropDown } from "components/utility/typeahead-dropdown";
import { DirectStaticFilterDataFetch, SearchStaticFilterDataFetch } from "utils/lookup/static-endpoint";
import { genLastUpdateDescription } from "utils/custom-fields/custom-fields-autocalc";
import { CustomFieldPopup } from "containers/dashboards/sections/customField/custom-fields-popup";
import { customFieldType } from "utils/lookup/index";
import * as _ from "lodash";

interface CustomFieldsProps extends Props<CustomFields> {
    custom?: CustomModels.Custom[];
    isEditMode?: boolean;
    onCustomFieldChange?: (type: string, obj: CustomModels.Custom[]) => any;
    isBrokerAlgos?: boolean;
    openFrom?: string;
}

interface CustomFieldsState {
    custom?: CustomModels.Custom[];
    isEditMode?: boolean;
    showCustomFieldPopup?: boolean;
}

export class CustomFields extends Component<CustomFieldsProps, CustomFieldsState> {
    constructor(props) {
        super(props);
        this.state = {
            custom: _.cloneDeep(this.props.custom),
            isEditMode: this.props.isEditMode,
            showCustomFieldPopup: false,
        };
    }

    componentDidMount() {
        this.props.onCustomFieldChange("mount", this.state.custom);
    }

    componentWillReceiveProps(newProps) {
        if (newProps) {
            this.setState({isEditMode: newProps.isEditMode});
            if (newProps.custom) {
                this.setState({
                    custom: _.cloneDeep(newProps.custom),
                });
            }
        }
    }

    onCustomFieldChange = (id?: string, fieldId?: string) => {
        let customFields = this.state.custom.slice();
        let field = _.find(customFields, {id: fieldId});
        let fieldIndex = _.findIndex(customFields, {id: fieldId});
        if (field && field.isVisible) {
            if (field.fieldType === "String") {
                if (id) {
                    if (field.id === fieldId) {
                        field.value = id;
                    }
                }  else {
                    let fieldValue = this.refs[field.name] && this.refs[field.name]["textInput"].value;
                    field.value = fieldValue ? fieldValue : null;
                }
            } else if ( field.fieldType === "Decimal") {
                let fieldValue = this.refs[field.name]["textInput"].value;
                field.value = fieldValue ? fieldValue : null;
            } else if (field.fieldType === "DateTime" || field.fieldType === "Time") {
                let dateTimeValue = this.refs[field.name]["textInputDatePicker"].value;
                field.value = dateTimeValue ? moment(dateTimeValue).format("M/D/YY") : "";
            } else if (field.fieldType === "Bool") {
                let fieldChecked = this.refs[field.name]["checkboxInput"]["checked"];
                field.value = fieldChecked;
            }
        }
        if (fieldIndex > -1) {
            customFields[fieldIndex] = field;
        }
        this.setState({custom : customFields});
        this.props.onCustomFieldChange("change", customFields);
    };

    openCustomField = () => {
        this.setState({ showCustomFieldPopup: true });
    };

    closeCustomField = (customFields?: BrokerModels.CustomFields[]) => {
        let custom: any = [];
        let totalFields = [];
        if (customFields) {
            _.forEach(customFields, (section) => {
                _.forEach(section["fields"], (field) => {
                    totalFields.push(field);
                    let customField = {};
                    let valueLookup;
                    if (field.values) {
                        _.forEach(field.values, value => {
                            valueLookup = valueLookup ? valueLookup + "|" + value : value;
                        });
                    }
                    const fieldType = _.find(customFieldType, {"id": String(field.fieldType)});
                    customField["name"] = field.name;
                    customField["valueLookup"] = valueLookup ? valueLookup : null;
                    customField["fieldType"] = fieldType.display;
                    customField["sectionName"] = section.name;
                    customField["sectionDisplayOrder"] = section.displayOrder;
                    customField["displayOrder"] = field.displayOrder;
                    customField["isVisible"] = field.visible;
                    customField["isHistorical"] = field.isHistorical;
                    customField["width"] = field.width;
                    customField["sectionWidth"] = section.width;
                    customField["id"] = field.id;
                    customField["value"] = field["value"] ? field["value"] : null;
                    custom.push(customField);
                });
            });
        }
        custom = _.sortBy(custom, field => field["displayOrder"]);
        this.setState({ showCustomFieldPopup: false, custom });
        this.props.onCustomFieldChange("change", custom);
    };

    render() {
        const customGroupNameStyle = {
            fontSize: "16px",
            fontWeight: 400,
            padding: "0 0 5px 15px",
            marginTop: "10px",
        };
        const { isEditMode, showCustomFieldPopup } = this.state;
        const { isBrokerAlgos, custom, openFrom } = this.props;
        let customFields = [];

        if (this.state.custom && this.state.custom.length > 0) {
            let custom = this.state.custom.slice();
            let displaySections = _.uniqBy(custom, "sectionDisplayOrder")
                .sort((s1, s2) => s2 === null ? 1 : s1 > s2 ? 1 : -1);

            displaySections.map((section: CustomModels.Custom, k) => {
                let customSectionId = section.sectionName  && section.sectionName.replace(/\s/g, "").toLowerCase();
                let itemsList = [];
                let customFieldsBySection = [];
                custom.map((field: CustomModels.Custom, i) => {
                    if (field.sectionDisplayOrder === section.sectionDisplayOrder && field.isVisible) {
                        customFieldsBySection.push(field);

                        if (field.valueLookup) {
                            field.values = field.valueLookup.split("| ");
                        }
                        if (field.fieldType === "String" || field.fieldType === "Percent") {
                            let stringFieldValues = [];
                            if (field.values && field.values.length > 1)  {
                                _.forOwn(field.values, (value) => {
                                        stringFieldValues.push({
                                            id: value,
                                            display: value,
                                        });
                                });
                                let fieldValueLookup = {
                                    search: new SearchStaticFilterDataFetch(stringFieldValues),
                                    direct: new DirectStaticFilterDataFetch(stringFieldValues),
                                    displayName: "",
                                } as SearchModels.LookUp;
                                itemsList.push (
                                    <div key={field.id + field.values}
                                         className={(field.width === 2 ? "col-sm-6 " : "col-sm-12 ") +
                                                    (!field.value && !isEditMode ? "hidden" : "show")}>
                                        <div className={"input-group form-group fg-float m-b-0" +
                                                        (isBrokerAlgos ? " m-l-m-15" : "")}>
                                            <span className="input-group-addon" />
                                            <div className={"fg-line " + (field.value ? "fg-toggled" : "")
                                                            + (!isEditMode ? " read-only-mode" : "")} >
                                                <TypeAheadDropDown
                                                    lookUp={fieldValueLookup}
                                                    placeHolderOverride=" "
                                                    defaultSelection={field.value}
                                                    onSelectionChanged={(id, type) => {
                                                        if(id) {this.onCustomFieldChange(id, field.id); }} }
                                                    height={30}
                                                />
                                                <label className="fg-label" id="field_label">
                                                    {field.name}
                                                </label>
                                            </div>
                                        </div>
                                    </div>);
                            } else {
                                itemsList.push(
                                    <div key={field.id + field.value}
                                         className={(field.width === 2 ? "col-sm-6 " : "col-sm-12 ") +
                                         (!field.value && !isEditMode ? "hidden" : "show") }>
                                        <div className={"input-group form-group fg-float m-b-5" +
                                                (isBrokerAlgos ? " m-l-m-15" : "")}>
                                            <span className="input-group-addon"/>
                                            <TextInputFloating
                                                labelText={field.name}
                                                ref={field.name}
                                                isReadOnly={!isEditMode || field.autoCalculate}
                                                initialText={field.value !== null ? String(field.value) : ""}
                                                suppressTopMargin={true}
                                                onBlur={() => this.onCustomFieldChange(null, field.id)}/>
                                            {field.autoCalculate && !isEditMode &&
                                                genLastUpdateDescription(field.asOf, 20)
                                            }
                                        </div>
                                    </div>
                                );
                            }
                        } else if (field.fieldType === "Decimal") {
                            itemsList.push(
                                <div key={field.id + field.value}
                                     className={(field.width === 2 ? "col-sm-6 " : "col-sm-12 ") +
                                     (!field.value && !isEditMode ? "hidden" : "show") }>
                                    <div className={"input-group form-group fg-float m-b-5" +
                                                    (isBrokerAlgos ? " m-l-m-15" : "")}>
                                        <span className="input-group-addon"/>
                                        <TextInputFloating
                                            labelText={field.name}
                                            ref={field.name}
                                            isReadOnly={!isEditMode || field.autoCalculate}
                                            initialText={field.value !== null ? String(field.value) : ""}
                                            suppressTopMargin={true}
                                            onBlur={() => this.onCustomFieldChange(null, field.id)}/>
                                        {field.autoCalculate && !isEditMode &&
                                            genLastUpdateDescription(field.asOf, 20)
                                        }
                                    </div>
                                </div>
                            );
                        } else if (field.fieldType === "DateTime" || field.fieldType === "Time") {
                            itemsList.push(
                                <div key={field.id + field.value}
                                     className={(field.width === 2 ? "col-sm-6 " : "col-sm-12 ") +
                                     (!field.value && !isEditMode ? "hidden" : "show") }>
                                    <div className={"input-group form-group fg-float m-b-5" +
                                                        (isBrokerAlgos ? " m-l-m-15" : "")}>
                                        <span className="input-group-addon">
                                            <i className="zmdi zmdi-calendar"/>
                                        </span>
                                        <TextInputDatePicker
                                            labelText={field.name}
                                            ref={field.name}
                                            inputClassName="date-picker"
                                            className={"dtp-container"}
                                            isReadOnly={!isEditMode || field.autoCalculate}
                                            initialText={field.value ? (isBrokerAlgos ?
                                                        moment(field.value, "MMM DD YYYY HH:mma").format("M/D/YY") :
                                                        moment(field.value).format("M/D/YY")) : ""}
                                            dateFormat={"M/D/YY"}
                                            onBlur={() => this.onCustomFieldChange(null, field.id)}
                                            suppressTopMargin />
                                        {field.autoCalculate && !isEditMode &&
                                            genLastUpdateDescription(field.asOf, 20)
                                        }
                                    </div>
                                </div>  );
                        } else if (field.fieldType === "Bool") {
                            itemsList.push(
                                <div key={field.id + field.value}
                                     className={(field.width === 2 ? "col-sm-6 " : "col-sm-12 ")}>
                                    <CheckboxInput
                                        className={(isBrokerAlgos ? "m-l-15" : "m-l-30 ") +
                                                    (!isEditMode ? "read-only-mode " : "")}
                                        labelText={field.name}
                                        ref={field.name}
                                        initialChecked={Boolean(field.value)}
                                        onCheckboxChange={() => this.onCustomFieldChange(null, field.id)}
                                    />
                                </div>);
                        }
                    }
                });
                customFields.push(
                    <div key={section.sectionDisplayOrder}
                         className={section.sectionWidth === 1 ? "col-sm-12 " : "col-sm-6 "
                         + ((_.filter(customFieldsBySection,(obj) => {
                            return obj.value || obj.fieldType === "Bool"; })).length === 0
                            && !isEditMode ? "hidden" : "show")}>
                        <div className={"card-header m-l-m-15 " + (isBrokerAlgos ? "m-b-15" : "p-15")}
                             id={customSectionId}>
                            <h3 style={customGroupNameStyle}>
                                <i className="zmdi zmdi-settings m-r-15"/>
                                {section.sectionName ? section.sectionName : "Custom Fields"}
                            </h3>
                        </div>
                        {itemsList}
                    </div>
                );
            });
        }

        return (
            <div>
                <div className={"row " + ((!this.state.custom || this.state.custom.length === 0)  ? "hidden" : "show") }>
                    {customFields}
                </div>
                {isEditMode && openFrom &&
                    <div style={{marginLeft: "40px"}}>
                        <span className="span-link clickable" onClick={this.openCustomField}>
                            Add/Edit Custom Fields
                        </span>
                    </div>
                }
                {showCustomFieldPopup &&
                    <CustomFieldPopup
                        onClose={this.closeCustomField}
                        openFrom={openFrom}
                    >
                    </CustomFieldPopup>
                }
            </div>
        );
    }
}
