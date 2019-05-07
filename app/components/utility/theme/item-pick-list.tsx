import { Props, Component } from "react";
import { TypeAheadDropDown } from "components/utility/typeahead-dropdown";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { ApplicationState } from "redux/reducers/index";

interface ItemPickListProps extends Props<ItemPickListView> {
    selectedList?: any;
    name?: string;
    lookUp?: SearchModels.LookUp;
    actions?: { search: (getter: SearchModels.GetData, searchValue: string) =>
        Axios.IPromise<SearchModels.SearchItem[]> };
    isEditMode?: boolean;
    onChangePercentage?: (ispercentageError: boolean) => void;
    onSelectionChanged: (selectedValues: any) => void;
    isSecurityList?: boolean;
    placeholder?: string;
    addNewItem?: string;
}

interface ItemPickListState {
    data?: SearchModels.SearchItem[];
    isSingleView?: boolean;
    singleSelectedItem?: any;
    percentageError?: boolean;
    primaryError?: boolean;
    primaryErrorText?: string;
    isExpandedList?: boolean;
    forceRefreshCounter?: number;
}

const actions = {
    search: (getter: SearchModels.GetData, searchValue: string) => {
        return (dispatch, getState) => {
            return getter.getData(getState, "", searchValue)
                .then(items => items).catch(error => console.error(error));
        };
    },
};

const mapDispatchToProps = (dispatch: Redux.Dispatch) => {
    return { actions: bindActionCreators(actions, dispatch) };
};

const mapStateToProps = (state: ApplicationState, ownProps: ItemPickListProps) => {
    return ownProps;
};

export class ItemPickListView extends Component<ItemPickListProps, ItemPickListState> {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            isSingleView: true,
            percentageError: false,
            primaryError: false,
            primaryErrorText: "",
            isExpandedList: !this.props.isSecurityList,
            forceRefreshCounter: 0,
        };
    }

    componentDidMount() {
        if (this.props.selectedList.length > 0) {
            if (this.props.selectedList.length === 1) {
                this.setState({singleSelectedItem: this.props.selectedList[0]});
            } else {
                this.setState({isSingleView: false});
            }
        }
    }

    componentDidUpdate() {
        const $this = $(this.refs["itemPickList"]);
        const $tooltips = $this.find(".tooltip-item");
        const $tooltipsPrimary = $this.find(".tooltip-item-primary");
        if ($tooltips[0]) {
            $tooltips.tooltip({placement: "right"});
        }
        if ($tooltipsPrimary[0]) {
            $tooltipsPrimary.tooltip();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.selectedList) {
            if (!_.isEqual(this.props.selectedList, nextProps.selectedList)) {
                this.pullInitialData();
            }
            if (!nextProps.isEditMode && nextProps.selectedList.length > 0) {
                this.setState({isSingleView: (nextProps.selectedList.length === 1)});
            }
        }
    }

    componentWillMount() {
        // Retrieve data at the first time component is mounted,
        // we need this data because of an owner component can update selected value and not only by default value.
        this.pullInitialData();
    }

    pullInitialData = () => {
        // ToDo: the API does not yet support retrieving "Top 100", so currently all data is pulled back.
        this.props.actions.search(this.props.lookUp.search, "")
            .then((items: SearchModels.SearchItem[]) => {

                const data = this.truncateData(items);
                if (this.props.selectedList && this.props.selectedList != null) {
                    if (this.props.selectedList.length === 1) {
                        this.props.selectedList[0].isPrimary = true;
                        if (!this.props.selectedList[0].percentage) {
                            this.props.selectedList[0].percentage = 1;
                        }
                    }
                    this.assignSelectedData(this.props.selectedList, data);
                }
                this.setState({data});
            });
    };

    assignSelectedData = (selectedList, data) => {
        const {onChangePercentage} = this.props;
        let totalPercent = 0;
        this.setState({primaryError: false, primaryErrorText: ""});
        _.forOwn(selectedList, (item, i) => {
            let setup: SecurityModels.Setup[] = _.filter(data, {"id": item.id});
            if (setup.length > 0) {
                setup[0].isPrimary = item.isPrimary;
                setup[0].percentage = Number(item.percentage) ? String(item.percentage)  : null;
            }
            totalPercent += Number(item.percentage) ? Number(item.percentage) : 0;
            if ((!Number(item.percentage)) && item.isPrimary) {
                this.setState({
                    primaryError: true,
                    primaryErrorText: "The item " + item.display + " is set as a primary " +
                        this.props.name || this.props.placeholder +
                        ", but it has not been allocated a percentage. " +
                        "Please remove the primary designation or allocate a percentage."});
            }
        });
        this.setState({percentageError: (totalPercent > 1)});
        onChangePercentage(totalPercent > 1);
        if (totalPercent === 0 || selectedList.length === 1) {
            this.setState({singleSelectedItem: selectedList[0]});
        }
        this.setState({data});
    };

    truncateData = (items: SearchModels.SearchItem[]) => items && items.sort((a, b) => {
        // The value a `display` may be undefined or null, so protect against this with a falsey check.
        if (a.display === b.display) {
            return 0;
        }
        if (!a.display) {
            return -1;
        }
        if (!b.display) {
            return 1;
        }
        return a.display.localeCompare(b.display);
    }).slice(0, 200);

    checkSelection = (id) => {
        _.forOwn(this.state.data, (item, i) => {
            if (item.id === id) {
                item["isPrimary"] = this.refs[id]["checked"];
            } else {
                item["isPrimary"] = false;
            }
        });
        this.setState({data: this.state.data});
        this.props.onSelectionChanged(this.sendValidObjects(this.state.data));
    };

    addPercentage = (id, value) => {
        const forceRefreshCounter = this.state.forceRefreshCounter + 1;
        let setup: SecurityModels.Setup = _.filter(this.state.data, {"id": id})[0];
        value = Number(value.replace("%", ""));
        if (value <= 100 || value <= 100) {
            setup.percentage = String(value / 100);
            let primary: SecurityModels.Setup[] = _.filter(this.state.data, {"isPrimary": true});
            if (primary.length === 0) {
                setup.isPrimary = true;
            }
        } else {
            setup.percentage = "0";
        }
        this.setState({data: this.state.data,  forceRefreshCounter});
        this.props.onSelectionChanged(this.sendValidObjects(this.state.data));
    };

    setSingleView = () => {
        let setupArr = this.sendValidObjects(this.state.data);
        let primary: SecurityModels.Setup[] = _.filter(setupArr, {"isPrimary": true});
        if (primary.length > 0) {
            this.assignSingleView(primary[0].id);
        } else {
            this.setState({singleSelectedItem: null, isSingleView: true});
        }
    };

    sendValidObjects = (data) => {
        const {onChangePercentage} = this.props;
        let setups = [];
        let totalPercent = 0;
        this.setState({primaryError: false, primaryErrorText: ""});
        _.forOwn(data, (item, i) => {
            item["percentage"] = Number(item.percentage) ? Number(item.percentage) : null;
            if (item.percentage || item.isPrimary) {
                setups.push(item);
                totalPercent += item.percentage ? Number(item.percentage) : 0;
            }
            if (!item.percentage && item.isPrimary) {
                this.setState({primaryError: true, primaryErrorText: "The item " + item.display +
                    " is set as a primary " + this.props.name || this.props.placeholder +
                    ", but it has not been allocated a percentage. " +
                    "Please remove the primary designation or allocate a percentage."});
            }
        });
        this.setState({percentageError: (totalPercent > 1)});
        onChangePercentage(totalPercent > 1);
        return setups;
    };

    assignSingleView = (id, label?: string) => {
        let data = _.cloneDeep(this.state.data);
        if (id) {
            // to add newly created item to the list
            const findId = _.findIndex(data, dataItem => dataItem.id === id);
            if (findId === -1) {
                data.push({
                    id,
                    display: label,
                });
            }
        }
        _.forOwn(data, (item: SecurityModels.Setup, i) => {
            if (item.id === id) {
                item.isPrimary = true;
                item.percentage = "1";
                this.setState({singleSelectedItem: item});
            } else {
                item.isPrimary = false;
                item.percentage = "";
            }
        });
        this.setState({data, isSingleView: true});
        this.props.onSelectionChanged(this.sendValidObjects(this.state.data));
    };

    setSingleSelect = (id, type) => {
        this.assignSingleView(id, type);
    };

    toggleMultiselectList = (e) => {
        const { isSecurityList } = this.props;
        // Toggle only if in security classification screen
        if (isSecurityList) {
            this.setState({
                isExpandedList: !this.state.isExpandedList,
            });
        }
    };

    render() {
        const { isSecurityList, placeholder } = this.props;
        const { isExpandedList } = this.state;
        const rows = [];

        const truncateText = {
            width: "85%",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            position: "relative",
            marginTop: "8px",
            height: "25px",
        };

        let data = _.cloneDeep(this.state.data);
        if (data && data.length > 0) {
            if (_.findIndex(data, item => item["isPrimary"] === true) > -1) {
                data = data.map(item => {
                    if (!item["percentage"]) {
                        item["percentage"] = 0;
                        return item;
                    }
                    return item;
                });
                data = _.orderBy(data, ["percentage"], ["desc"]);
            }
            let selectedList = [];
            _.forOwn(data, (item, i) => {
                if ((this.props.isEditMode || item.percentage || item.isPrimary) && isExpandedList) {
                    rows.push(
                        <tr key={i && item.id} onClick={e => { e.preventDefault(); e.stopPropagation();} }>
                            <td className="p-l-0">
                                <div className="check-item">
                                    <div title="Set Primary"
                                         className={"radio m-t-0 m-b-15 tooltip-item-primary " +
                                            (this.props.isEditMode ? "" : "read-only-mode")}>
                                        <input type="radio"
                                               ref={item.id}
                                               checked={item.isPrimary}
                                               onChange={(e) => {
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                    this.checkSelection(item.id);
                                               }}
                                        />
                                        <i className="input-helper"/>
                                    </div>
                                </div>
                            </td>
                            <td style={{
                                    wordWrap: "break-word",
                                    wordBreak: "break-word",
                                    whiteSpace: "normal",
                                }}
                            >
                                {item.display}
                            </td>
                            <td className="p-r-0">
                                <div key={item.percentage + item.id + this.state.forceRefreshCounter}
                                     className={this.props.isEditMode ? "" : "read-only-mode"}
                                     style={{border: "1px solid #cccccc", marginRight: "20px"}}>
                                    <input type="text"
                                           ref={"text_" + item.id}
                                           style={{border: "none", boxShadow: "none",
                                                        width: "40px", padding: "1px 4px"}}
                                           onBlur={(e) => {
                                                this.addPercentage(item.id, e.target["value"]); }}
                                           defaultValue={item.percentage ? (item.percentage * 100) + "%" : ""}
                                    />
                                </div>
                            </td>
                        </tr>
                    );
                } else if (item.percentage || item.isPrimary) {
                    selectedList.push((item.display) + " " +
                        (item.percentage ? (item.percentage * 100) + "%" : ""));
                }
            });
            if (!isExpandedList) {
                rows.push(
                    <span title={selectedList.join(", ")}>
                        {selectedList.join(", ")}
                    </span>
                );
            }
        }
        return (
            <div ref={"itemPickList"}>
                {this.state.isSingleView &&
                    <div className={"input-group fg-float " + (isSecurityList && "m-b-0")} style={{width: "100%"}}>
                        <span className={!isSecurityList && "input-group-addon"}>
                            <i/>
                        </span>
                        { this.props.isEditMode &&
                            <span className="input-group-addon"
                                  style={{position: "absolute", zIndex: 7, right: "10px", top: "0px"}}>
                                <i title="Assign multiple items" style={{color: "#959595"}}
                                   className={"tooltip-item zmdi zmdi-format-line-spacing " +
                                            (this.props.isEditMode ?  "clickable" : "")}
                                   onClick={() => this.props.isEditMode ?
                                        this.setState({isSingleView: false, isExpandedList: true}) : ""}/>
                            </span>
                        }
                        <div className={"fg-line " + (this.state.singleSelectedItem ? "fg-toggled" : "") +
                                    (!this.props.isEditMode ? " read-only-mode" : "")}>
                            <TypeAheadDropDown onSelectionChanged={(id, type) => { this.setSingleSelect(id, type); } }
                                               lookUp={this.props.lookUp}
                                               placeHolderOverride={placeholder ? placeholder : ""}
                                               defaultSelection={this.state.singleSelectedItem ?
                                                        this.state.singleSelectedItem.id : ""}
                                               selection={this.state.singleSelectedItem ?
                                                        this.state.singleSelectedItem.id : ""}
                                               addNewItem={this.props.addNewItem}
                            />
                            <label className="fg-label" id="security_type_label">{this.props.name}</label>
                        </div>
                    </div>
                }
                {!this.state.isSingleView &&
                    <div
                        className={(isSecurityList ? "col-xs-12 p-0 " : " ") + (!isExpandedList && "clickable")}
                        onClick={(e) => this.toggleMultiselectList(e)}
                        style={{ borderBottom: !isExpandedList && "1px solid #e0e0e0",
                                height: !isExpandedList && "35px",
                                position: !isExpandedList && "relative",
                                top: !isExpandedList && "-7px",
                                minWidth: isExpandedList && "185px",
                        }}>
                        { this.props.isEditMode &&
                            <span className="input-group-addon"
                                  style={{
                                      position:"absolute",
                                      zIndex: 100,
                                      right: isSecurityList ? (isExpandedList ? "-15px" : "5px") : "30px",
                                      top: isSecurityList ? (isExpandedList ? "-15px" : "0px") : "-20px",
                                  }}>
                                <i title="Assign single item" style={{color: "#959595"}}
                                   className={"tooltip-item zmdi zmdi-format-valign-center " +
                                        (this.props.isEditMode ?  "clickable" : "")}
                                   onClick={() => this.props.isEditMode ? this.setSingleView() : ""}/>
                            </span>
                        }
                        { this.props.isEditMode && !isExpandedList &&
                            <span className="input-group-addon"
                                  style={{
                                          position: "absolute",
                                          top: 0,
                                          right: 0,
                                          content: "",
                                          height: "calc(100% - 2px)",
                                          width: "30px",
                                          backgroundColor: "#FFF",
                                          backgroundPosition: "right calc(100% - 7px)",
                                          backgroundRepeat: "no-repeat",
                                          backgroundImage: "url(../img/select.png)",
                                          ointerEvents: "none",
                                          zIndex: 5,
                                          minWidth: "11px",
                                      }}>
                            </span>
                        }
                        {isExpandedList ?
                            <div className={"col-sm-12 m-b-20 " + (isSecurityList ? "p-0" : "")}>
                                <div className={"col-sm-12 " + (isSecurityList ? "p-0" : "")}>
                                    <label className="fg-label classification-label">{this.props.name}</label>
                                    <div className="table-responsive m-t-10 m-b-10"
                                         style={{ backgroundColor: "transparent",
                                                  maxHeight: this.props.isEditMode ? "185px" : "100%",
                                                  overflow: "auto"}}>
                                        <table className="table table-vmiddle bootgrid-table classifications"
                                               style={{ backgroundColor: "transparent" }}>
                                            <colgroup>
                                                <col style={{ width: "25%" }}/>
                                                <col style={{ width: "65%" }}/>
                                                <col style={{ width: "10%" }}/>
                                            </colgroup>
                                            <tbody>
                                                {rows}
                                            </tbody>
                                        </table>
                                    </div>
                                    {this.state.percentageError ?
                                        <p style={{color: "#F44336", margin: "0px"}}>
                                            Percentage should not be more than 100%.
                                        </p>
                                        : null
                                    }
                                    {this.state.primaryError ?
                                        <p style={{color: "#F44336", margin: "0px"}}>
                                            {this.state.primaryErrorText}
                                        </p>
                                        : null
                                    }
                                </div>
                            </div>
                            :
                            <div className={"col-sm-12 " + (isSecurityList ? "p-0" : "")}>
                                <div className={"col-sm-12 " + (isSecurityList ? "p-0" : "")}>
                                    <div style={truncateText}>
                                        {rows}
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                }
            </div>
        );
    }
}
export const ItemPickList = connect(mapStateToProps, mapDispatchToProps)(ItemPickListView);
