import { Props, Component } from "react";
import { connect} from "react-redux";
import { bindActionCreators } from "redux";
import { ApplicationState } from "redux/reducers/index";
import * as _ from "lodash";
import { ModalWrapper } from "components/utility/modal-wrapper";
import { AddGroupModal } from "app/containers/settings/settings-setup-modals/add-group-modal";
import { ColorGroupActionCreators } from "redux/actions/settings/setups/color-group";

export interface Options {
    id?: string;
    name?: string;
}

const mapStateToProps = (state: ApplicationState, ownProps: ColorGroupEditorProps) => {
    const {settings: {setups: {colorGroups}}} = state;
    return _.assign({}, {colorGroups}, ownProps);
};

interface ColorGroupActions {
    colorGroupGet: () => any;
}

const mapDispatchToProps = (dispatch: any) => {
    return { actions: bindActionCreators(
            _.assign(
                {},
                ColorGroupActionCreators
            ) as ColorGroupActions, dispatch),
            dispatch,
    };
};

export interface ColorGroupEditorProps extends Props<ColorGroupEditorView> {
    defaultSelectedColorGroups: string[];
    isEditMode: boolean;
    buttonText?: string;
    nothingSelectedText?: string;
    actions?: ColorGroupActions;
    colorGroups?: SettingsModels.ColorGroup[];
}

interface ColorGroupEditorState {
    selectedOptions?: string[];
    colorGroups?: SettingsModels.ColorGroup[];
    showAddGroupModal?: boolean;
    showColorGroupModal?: boolean;
}

export class ColorGroupEditorView extends Component<ColorGroupEditorProps, ColorGroupEditorState> {

    constructor(props) {
        super(props);
        this.state = {
            selectedOptions: this.props.defaultSelectedColorGroups || [],
            colorGroups: this.props.colorGroups || [],
            showAddGroupModal: false,
            showColorGroupModal: false,
        };
    }

    getColorGroups = () => {
        return this.props.actions.colorGroupGet();
    };

    public getValues(): string[] {
        return this.state.selectedOptions;
    }

    onAddSelectionClick = (options: SettingsModels.ColorGroup) => {
        const selectedOptions = [...this.state.selectedOptions, options.id];
        this.setState({ selectedOptions });
    };

    onRemoveSelectionClick = (option: SettingsModels.ColorGroup) => {
        if (!this.props.isEditMode) {
            return;
        }
        const selectedOptions = this.state.selectedOptions.filter(item => item !== option.id);
        this.setState({ selectedOptions });
    };

    componentDidMount() {
        if (this.state.colorGroups == null || this.state.colorGroups.length === 0) {
            this.getColorGroups();
        }
    }

    componentWillReceiveProps(newProps: ColorGroupEditorProps) {
        if (!newProps.isEditMode) {
            if (newProps.defaultSelectedColorGroups) {
                this.setState({selectedOptions: newProps.defaultSelectedColorGroups});
            }
        }
        if (!_.isEqual(newProps.colorGroups, this.props.colorGroups)) {
            this.setState({
                colorGroups: newProps.colorGroups,
            });
        }
    }

    onCancelAddGroupModal = () => {
        this.setState({
            showAddGroupModal: false,
        });
    };

    showColorGroupModal = () => {
        this.setState({
            showColorGroupModal: true,
        });
    };

    cancelColorGroupModal = () => {
        this.setState({showColorGroupModal: false});
    };

    render() {
        // Split options into selected/unselected.
        const partionedOptions = _.partition(this.state.colorGroups, colorGroup =>
                                    _.includes(this.state.selectedOptions, colorGroup["id"]));
        const selected: SettingsModels.ColorGroup[] = partionedOptions[0];
        const unselected: SettingsModels.ColorGroup[] = partionedOptions[1];
        return (
            <div>
                <span>
                    {selected.map(option =>
                        <button
                            key={option.id}
                            onClick={() => this.onRemoveSelectionClick(option)}
                            className="btn btn-warning waves-effect m-t-5 m-b-5 m-r-5"
                            style={{backgroundColor: option.color}} >
                            {option.displayName}
                            {this.props.isEditMode && <i className="zmdi zmdi-close-circle m-l-5"/>}
                        </button>)
                        }
                    {this.props.isEditMode && unselected.length > 0 &&
                        <div className="color-group-dropdown display-inline">
                             <button type="button"
                                     className="btn btn-primary btn-sm waves-effect"
                                     onClick={e => this.setState({showAddGroupModal: true})}>
                                Add Group
                             </button>
                        </div>}
                    {!this.props.isEditMode && selected.length === 0 && this.props.nothingSelectedText &&
                        <em>{this.props.nothingSelectedText}</em>
                        }
                </span>

                {this.state.showAddGroupModal &&
                <div style={{ display: (!!this.state.showAddGroupModal ? "inline" : "none") }}>

                    <ModalWrapper
                        onClose={this.onCancelAddGroupModal}
                        width = "70%"
                        offset="-35%"
                        height="400px"
                        overflow="visible"
                    >
                        <div>
                            <div className="pull-right">
                                <i className="zmdi zmdi-hc-2x zmdi-close clickable"
                                   onClick={this.onCancelAddGroupModal}/>
                            </div>
                            <h2 className="pull-left title m-b-20 m-t-10 p-l-15">Add Group</h2>

                            <div>
                                <div className="col-xs-12 m-b-20 color-group-modal">
                                    {unselected.map(option =>
                                        <button
                                            key={option.id}
                                            onClick={() => this.onAddSelectionClick(option)}
                                            className="btn btn-warning waves-effect m-t-5 m-b-5 m-r-5"
                                            style={{backgroundColor: option.color}} >
                                            {option.displayName}
                                        </button>
                                    )}
                                </div>
                                <div className="col-xs-12">
                                    <em>Click a group to add it.</em>
                                </div>
                                <div className="col-xs-12">
                                    <button
                                        type="button"
                                        className="btn btn-primary m-t-15 btn-sm waves-effect"
                                        onClick={this.showColorGroupModal}
                                    >
                                        <i className="tm-icon zmdi zmdi-plus " />
                                        Add Group
                                    </button>
                                </div>
                                {(this.state.showColorGroupModal) &&
                                    <AddGroupModal
                                        onClose={this.cancelColorGroupModal}
                                    />
                                }
                            </div>

                            <div>
                                <button className="btn btn-default btn-sm waves-effect pull-right m-t-20"
                                        onClick={this.onCancelAddGroupModal}>
                                    Close
                                </button>
                            </div>

                        </div>
                    </ModalWrapper>
                </div>
                    }

            </div>

        );
    }
}

export const ColorGroupEditor =
    connect(mapStateToProps, mapDispatchToProps, null, { withRef: true, pure: false })(ColorGroupEditorView);
