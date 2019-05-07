import { Props, Component } from "react";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import { bindActionCreators } from "redux";
import { ApplicationState } from "redux/reducers/index";
import { CreateHouseholdDialog } from "containers/dashboards/sections/views/containers/create-household-dialog";
import { CreateClientDialog } from "containers/dashboards/sections/views/containers/create-client-dialog";
import { CreateAccountDialog } from "containers/dashboards/sections/views/containers/create-account-dialog";
import { CreateTransactionDialog } from "containers/dashboards/sections/views/containers/create-transaction-dialog";
import { CreateModelDialog } from "containers/dashboards/sections/views/containers/create-model-dialog";
import { CreateSecurityDialog } from "containers/dashboards/sections/views/containers/create-security-dialog";
import { CreateManagerDialog } from "containers/dashboards/sections/views/containers/create-manager-dialog";
import { CreatePriceDialog } from "containers/dashboards/sections/views/containers/create-price-dialog";
import { CreateFolderDialog } from "containers/dashboards/sections/documents-viewer/containers/create-folder-dialog";
import { RoundingRuleDialog } from "containers/dashboards/sections/views/containers/create-rounding-rule-dialog";
import { EquivalencyDialog } from "containers/dashboards/sections/views/containers/create-equivalency-dialog";
import { TradingRuleDialog } from "containers/dashboards/sections/views/containers/create-trading-rule-dialog";
import { BrokerDialog } from "containers/dashboards/sections/views/containers/create-broker-dialog";
import { FeeScheduleDialog } from "containers/dashboards/sections/views/containers/create-fee-schedule-dialog";
import { InvoiceDialog } from "containers/dashboards/sections/views/containers/create-invoice-dialog";
import { CustodianImportDialog } from "containers/settings/create-custodian-import-modal";
import { DocumentUploader, DocumentUploaderView }
    from "components/utility/document-uploader";
import { EditCustomGroupModal } from "containers/settings/custom-fields/edit-custom-group-modal";
import { EditCustomFieldsModal } from "containers/settings/custom-fields/edit-custom-field-modal";
import { LoginState } from "redux/reducers/login";
import { Permissions, hasPermission } from "components/utility/permission-constants/permissions";
import { PayoutScheduleDialog } from "containers/dashboards/sections/views/containers/create-payout-schedule-dialog";
import { CreateCompositeDialog } from "containers/dashboards/sections/composites/create-composite-dialog";
import { CreatePerformanceHistoryDialog } from
    "containers/dashboards/sections/views/containers/create-performance-history-dialog";
import { MockupModes } from "redux/actions/mockup";

interface Actions {
    push: ReactRouterRedux.PushAction;
}

interface AddButtonProps extends Props<AddButton> {
    actions?: Actions;
    onRefreshView?: (value?: boolean | string) => any;
    type: string;
    parentFolderId?: string;
    isPortalMode?: boolean;
    login?: LoginState;
    folderItems?: DocumentViewerModels.FolderInfo[];
    position?: string;
    fieldGroup?: BrokerModels.CustomFields;
    callingComponent?: string;
    strategyId?: string;
    onAddButtonClick?: (value?: string) => void;
    mockupMode?: MockupModes;
}

interface AddButtonState {
    showHouseholdModal?: boolean;
    showClientModal?: boolean;
    showAccountModal?: boolean;
    showTransactionModal?: boolean;
    showModelModal?: boolean;
    showSecurityModal?: boolean;
    showManagerModal?: boolean;
    showPriceModal?: boolean;
    showCreateFolderModal?: boolean;
    showRoundingRuleModal?: boolean;
    showEquivalencyModal?: boolean;
    showTradingRuleModal?: boolean;
    showBrokerModal?: boolean;
    showFeeScheduleModal?: boolean;
    showAccountInvoiceModal?: boolean;
    showEntityInvoiceModal?: boolean;
    showCustomFieldModal?: boolean;
    showCustomGroupModal?: boolean;
    showCustodianImportModal?: boolean;
    showPayoutScheduleModal?: boolean;
    showPerformanceHistoryModal?: boolean;
    showCompositeModal?: boolean;
}

const mapStateToProps = (state: ApplicationState, ownProps: AddButtonProps) => {
    const { isPortalMode } = state.login;
    const { login } = state;
    const { mockup: {mockupMode} } = state;
    return _.assign({}, { isPortalMode, login, mockupMode }, ownProps);
};

const mapDispatchToProps = (dispatch: Redux.Dispatch) => {
    return { actions: bindActionCreators(_.assign({}, { push }), dispatch) };
};

export class AddButton extends Component<AddButtonProps, AddButtonState> {

    documentUploader: { getWrappedInstance(): DocumentUploaderView };
    addButton: any;

    constructor(props) {
        super(props);
        this.state = {
            showHouseholdModal: false,
            showClientModal: false,
            showAccountModal: false,
            showTransactionModal: false,
            showModelModal: false,
            showSecurityModal: false,
            showRoundingRuleModal : false,
            showEquivalencyModal: false,
            showTradingRuleModal: false,
            showBrokerModal: false,
            showFeeScheduleModal: false,
            showAccountInvoiceModal: false,
            showEntityInvoiceModal: false,
            showCustomFieldModal: false,
            showCustomGroupModal: false,
            showCustodianImportModal: false,
            showPayoutScheduleModal: false,
            showPerformanceHistoryModal: false,
            showCompositeModal: false,
        };
    }

    /**
     * This event handler implements the MFB library's open/close action, 
     * which is performed by toggling an attribute on the main element of the menu.  
     */
    toggleButton = (evt) => {
        let target = evt.target;
        // First, check if the target is the menu itself. If it's a child
        // keep walking up the tree until we found the main element
        // where we can toggle the state.
        while (target && !target.getAttribute("data-mfb-toggle")) {
            target = target.parentNode;
            if (!target) { return; }
        }
        let currentState = target.getAttribute("data-mfb-state") === "open" ? "closed" : "open";
        target.setAttribute("data-mfb-state", currentState);
    };

    showRoleEditModal = () => {
        this.props.onRefreshView(true);
    };

    showUserEditModal = (type?: string) => {
        this.props.onAddButtonClick(type);
    };

    showHouseholdModal = () => {
        this.setState({ showHouseholdModal: true });
    };

    showClientModal = () => {
        this.setState({ showClientModal: true });
    };

    showAccountModal = () => {
        this.setState({ showAccountModal: true });
    };

    showTransactionModal = () => {
        this.setState({ showTransactionModal: true });
    };

    showModelModal = () => {
        this.setState({showModelModal: true});
    };

    showSecurityModal = () => {
        this.setState({ showSecurityModal: true });
    };

    showManagerModal = () => {
        this.setState({ showManagerModal: true });
    };

    showPriceModal = () => {
        this.setState({ showPriceModal: true });
    };

    createFolder = () => {
        this.setState({ showCreateFolderModal: true });
    };

    showRoundingModal = () => {
        this.setState({ showRoundingRuleModal : true });
    };

    showEquivalencyModal = () => {
        this.setState({ showEquivalencyModal : true });
    };

    showTradingModal = () => {
        this.setState({ showTradingRuleModal : true });
    };

    showBrokerModal = () => {
        this.setState({ showBrokerModal : true });
    };

    showFeeScheduleModal = () => {
        this.setState({ showFeeScheduleModal : true });
    };

    showPayoutScheduleModal = () => {
        this.setState({ showPayoutScheduleModal : true });
    };

    showPerformanceHistoryModal = () => {
        this.setState({ showPerformanceHistoryModal : true });
    };

    showAccountInvoiceModal = () => {
        this.setState({ showAccountInvoiceModal : true });
    };

    showEntityInvoiceModal = () => {
        this.setState({ showEntityInvoiceModal : true });
    };

    showCustomFieldModal = () => {
        this.setState({ showCustomFieldModal : true });
    };

    showCustomGroupModal = () => {
        this.setState({ showCustomGroupModal : true });
    };

    showCustodianImportModal = () => {
        this.setState({ showCustodianImportModal : true });
    };

    showCompositeModal = () => {
        this.setState({ showCompositeModal : true });
    };

    uploadDocument = () => {
        this.documentUploader.getWrappedInstance().uploadDocument(saveFunc => saveFunc());
    };

    isClientVisible = () => {
        const {type, isPortalMode, login} = this.props;
        return (hasPermission(login, Permissions.createFolios) &&
                 (!isPortalMode && (type.indexOf("Folios") > -1 || type.indexOf("Client") > -1)) &&
                 hasPermission(login, Permissions.edit));
    };

    isHouseholdVisible = () => {
        const {type, isPortalMode, login} = this.props;
        return (hasPermission(login, Permissions.createFolios) &&
        (!isPortalMode && (type.indexOf("Folios") > -1 || type.indexOf("Household") > -1)) &&
            hasPermission(login, Permissions.edit));
    };

    isAccountVisible = () => {
        const {type, isPortalMode, login} = this.props;
        return (hasPermission(login, Permissions.createFolios) &&
        (!isPortalMode && (type.indexOf("Folios") > -1 || type.indexOf("Account") > -1)) &&
            hasPermission(login, Permissions.edit));
    };

    isModelVisible = () => {
        const {type, isPortalMode} = this.props;
        return !isPortalMode && type === "Models";
    };

    isTransactionVisible = () => {
        const {type, isPortalMode, login} = this.props;
        return (!isPortalMode && type === "Transactions" && hasPermission(login, Permissions.transaction)
            && hasPermission(login, Permissions.edit));
    };

    isSecurityVisible = () => {
        const {type, isPortalMode} = this.props;
        return !isPortalMode && type === "Securities";
    };

    isManagerVisible = () => {
        const {type, isPortalMode} = this.props;
        return !isPortalMode && type === "Managers";
    };

    isPriceVisible = () => {
        const {type, isPortalMode} = this.props;
        return !isPortalMode && type === "GridView_Prices";
    };

    isDocumentsViewerVisible = () => {
        const {type} = this.props;
        return type === "Documents_Viewer";
    };

    isUsersVisible = () => {
        const {type} = this.props;
        return type === "Users_Settings";
    };

    isRolesVisible = () => {
        const {type} = this.props;
        return type === "Roles_Settings";
    };

    isRoundingRulesVisible = () => {
        const {type, isPortalMode} = this.props;
        return !isPortalMode && type === "RoundingRuleSets";
    };

    isEquivalencyVisible = () => {
        const {type, isPortalMode} = this.props;
        return !isPortalMode && type === "EquivalencySets";
    };

    isTradingRulesVisible = () => {
        const {type, isPortalMode} = this.props;
        return !isPortalMode && type === "TradingRuleGroups";
    };

    isBrokerVisible = () => {
        const {type, isPortalMode} = this.props;
        return !isPortalMode && type === "Brokers";
    };

    isFeeScheduleVisible = () => {
        const {type, isPortalMode} = this.props;
        return !isPortalMode && type === "FeeSchedules";
    };

    isInvoicesVisible = () => {
        const {type, isPortalMode} = this.props;
        return !isPortalMode && type === "Invoices";
    };

    isCustomFieldsVisible = () => {
        const {type} = this.props;
        return type === "Custom_Fields";
    };

    isCustodianImportVisible = () => {
        const {type} = this.props;
        return type === "CustodianImport";
    };

    isPerformanceHistoryModalVisible = () => {
        const {type} = this.props;
        return type === "PerformanceHistory";
    };

    isCompositesModalVisible = () => {
        const {type} = this.props;
        return type === "Composites";
    };

    onSaveCustodialImport = (id?: string) => {
        const { actions, onRefreshView } = this.props;
        onRefreshView();
        actions.push(`/settings?tab=Custodial Imports&importId=${id}`);
    };

    onCloseImportModal = () => {
        this.setState({ showCustodianImportModal: false });
    };

    render() {
        const { actions, onRefreshView, folderItems, position, mockupMode } = this.props;
        return (
            <div>
                { this.props.type &&  (this.isAccountVisible() || this.isTransactionVisible() || this.isModelVisible()
                    || this.isClientVisible() || this.isHouseholdVisible() || this.isSecurityVisible()
                    || this.isManagerVisible() || this.isPriceVisible() || this.isDocumentsViewerVisible()
                    || this.isUsersVisible() || this.isRolesVisible() || this.isRoundingRulesVisible()
                    || this.isEquivalencyVisible() || this.isTradingRulesVisible() || this.isFeeScheduleVisible()
                    || this.isInvoicesVisible() || this.isBrokerVisible() || this.isCustomFieldsVisible() ||
                    this.isPerformanceHistoryModalVisible() || this.isCustodianImportVisible() ||
                    this.isCompositesModalVisible()) &&
                    <ul
                        ref={(c) => { this.addButton = c; }}
                        id="menu" className="mfb-component--br mfb-slidein"
                        style={{ position: position || null }}
                        data-mfb-toggle="click"
                        onClick={this.toggleButton}>
                        <li className="mfb-component__wrap">
                            <span data-mfb-label="Close" className="clickable mfb-component__button--main">
                                <i className="mfb-component__main-icon--resting zmdi zmdi-plus"/>
                                <i className="mfb-component__main-icon--active zmdi zmdi-close"/>
                            </span>
                            <ul className="mfb-component__list">
                                {this.isUsersVisible() &&
                                    <li>
                                        <span onClick={() => this.showUserEditModal("portal")}
                                            data-mfb-label="Portal User"
                                            className="clickable mfb-component__button--child">
                                            <i className="mfb-component__child-icon zmdi zmdi-account"/>
                                        </span>
                                    </li>
                                }
                                {this.isUsersVisible() &&
                                    <li>
                                        <span onClick={() => this.showUserEditModal("team_member")}
                                              data-mfb-label="Team Member"
                                              className="clickable mfb-component__button--child">
                                            <i className="mfb-component__child-icon zmdi zmdi-account-circle"/>
                                        </span>
                                    </li>

                                }
                                {this.isUsersVisible() &&
                                    <li>
                                        <span onClick={() => this.showUserEditModal("admin")}
                                              data-mfb-label="Administrator"
                                              className="clickable mfb-component__button--child">
                                            <i className="mfb-component__child-icon zmdi zmdi-accounts"/>
                                        </span>
                                    </li>
                                }
                                {this.isUsersVisible() &&
                                    <li>
                                        <span onClick={this.showRoleEditModal}
                                            data-mfb-label="Role"
                                            className="clickable mfb-component__button--child">
                                            <i className="mfb-component__child-icon zmdi zmdi-account"/>
                                        </span>
                                    </li>
                                }
                                {this.isTransactionVisible() &&
                                    <li>
                                        <span onClick={this.showTransactionModal}
                                            data-mfb-label="Transaction"
                                            className="clickable mfb-component__button--child">
                                            <i className="mfb-component__child-icon zmdi zmdi-swap"/>
                                        </span>
                                    </li>
                                }
                                {this.isModelVisible() &&
                                    <li>
                                        <span onClick={this.showModelModal}
                                              data-mfb-label="Model"
                                              className="clickable mfb-component__button--child">
                                            <i className="mfb-component__child-icon zmdi zmdi-swap"/>
                                        </span>
                                    </li>
                                }
                                {this.isAccountVisible() &&
                                    <li>
                                        <span onClick={this.showAccountModal}
                                            data-mfb-label="Account"
                                            className="clickable mfb-component__button--child">
                                            <i className="mfb-component__child-icon zmdi zmdi-grid"/>
                                        </span>
                                    </li>
                                }
                                {this.isClientVisible() &&
                                    <li>
                                        <span onClick={this.showClientModal} data-mfb-label="Client"
                                            className="clickable mfb-component__button--child">
                                            <i className="mfb-component__child-icon zmdi zmdi-account"/>
                                        </span>
                                    </li>
                                }
                                {this.isHouseholdVisible() &&
                                    <li>
                                        <span onClick={this.showHouseholdModal}
                                            data-mfb-label="Household"
                                            className="clickable mfb-component__button--child">
                                            <i className="mfb-component__child-icon zmdi zmdi-home"/>
                                        </span>
                                    </li>
                                }
                                {this.isSecurityVisible() &&
                                    <li>
                                        <span onClick={this.showSecurityModal}
                                            data-mfb-label="Security"
                                            className="clickable mfb-component__button--child">
                                            <i className="mfb-component__child-icon zmdi zmdi-balance"/>
                                        </span>
                                    </li>
                                }
                                {this.isManagerVisible() &&
                                    <li>
                                        <span onClick={this.showManagerModal}
                                            data-mfb-label="Employee" className="clickable mfb-component__button--child">
                                            <i className="mfb-component__child-icon zmdi zmdi-male-alt"/>
                                        </span>
                                    </li>
                                }
                                {this.isPriceVisible() &&
                                    <li>
                                        <span onClick={this.showPriceModal}
                                            data-mfb-label="Price" className="clickable mfb-component__button--child">
                                            <i className="mfb-component__child-icon zmdi zmdi-money-box"/>
                                        </span>
                                    </li>
                                }
                                {this.isDocumentsViewerVisible() &&
                                    <li>
                                        <span onClick={this.uploadDocument}
                                            data-mfb-label="Upload File"
                                            className="clickable mfb-component__button--child">
                                            <i className="mfb-component__child-icon zmdi zmdi-cloud-upload"/>
                                        </span>
                                    </li>
                                }
                                {this.isDocumentsViewerVisible() &&
                                    <li>
                                        <span onClick={this.createFolder}
                                            data-mfb-label="Create Folder"
                                            className="clickable mfb-component__button--child">
                                            <i className="mfb-component__child-icon zmdi zmdi-folder-outline"/>
                                        </span>
                                    </li>
                                }
                                {this.isRoundingRulesVisible() &&
                                    <li>
                                        <span onClick={this.showRoundingModal}
                                              data-mfb-label="Rounding Rule"
                                              className="clickable mfb-component__button--child">
                                            <i className="mfb-component__child-icon zmdi zmdi-chart-donut zmdi-hc-3x"/>
                                        </span>
                                    </li>
                                }
                                {this.isEquivalencyVisible() &&
                                    <li>
                                        <span onClick={this.showEquivalencyModal}
                                              data-mfb-label="Equivalency"
                                              className="clickable mfb-component__button--child">
                                            <i className="mfb-component__child-icon zmdi zmdi-equalizer zmdi-hc-3x"/>
                                        </span>
                                    </li>
                                }
                                {this.isTradingRulesVisible() &&
                                    <li>
                                        <span onClick={this.showTradingModal}
                                              data-mfb-label="Trading Rule"
                                              className="clickable mfb-component__button--child">
                                            <i className="mfb-component__child-icon zmdi zmdi-balance zmdi-hc-3x"/>
                                        </span>
                                    </li>
                                }
                                {this.isBrokerVisible() &&
                                    <li>
                                        <span onClick={this.showBrokerModal}
                                              data-mfb-label="Broker"
                                              className="clickable mfb-component__button--child">
                                            <i className="mfb-component__child-icon zmdi zmdi-balance zmdi-hc-3x"/>
                                        </span>
                                    </li>
                                }
                                {this.isFeeScheduleVisible() &&
                                    <li>
                                        <span onClick={this.showFeeScheduleModal}
                                              data-mfb-label="Fee Schedule"
                                              className="clickable mfb-component__button--child">
                                            <i className="mfb-component__child-icon zmdi zmdi-money zmdi-hc-3x"/>
                                        </span>
                                    </li>
                                }
                                {this.isFeeScheduleVisible() &&  mockupMode === MockupModes.Demo &&
                                    <li>
                                        <span onClick={this.showPayoutScheduleModal}
                                              data-mfb-label="Payout Schedule"
                                              className="clickable mfb-component__button--child">
                                            <i className="mfb-component__child-icon zmdi zmdi-money zmdi-hc-3x"/>
                                        </span>
                                    </li>
                                }
                                {this.isInvoicesVisible() &&
                                    <li>
                                        <span onClick={this.showEntityInvoiceModal}
                                              data-mfb-label="Entity Invoice"
                                              className="clickable mfb-component__button--child">
                                            <i className="mfb-component__child-icon zmdi zmdi-money-box zmdi-hc-3x"/>
                                        </span>
                                    </li>
                                }
                                {this.isInvoicesVisible() &&
                                    <li>
                                        <span onClick={this.showAccountInvoiceModal}
                                              data-mfb-label="Account Invoice"
                                              className="clickable mfb-component__button--child">
                                            <i className="mfb-component__child-icon zmdi zmdi-card zmdi-hc-3x"/>
                                        </span>
                                    </li>
                                }
                                {this.isCustomFieldsVisible() && this.props.fieldGroup &&
                                    <li>
                                        <span onClick={this.showCustomFieldModal}
                                              data-mfb-label="Field"
                                              className="clickable mfb-component__button--child">
                                            <i className="mfb-component__child-icon zmdi zmdi-edit"/>
                                        </span>
                                    </li>
                                }
                                {this.isCustomFieldsVisible() &&
                                    <li>
                                        <span onClick={this.showCustomGroupModal}
                                              data-mfb-label="Section"
                                              className="clickable mfb-component__button--child">
                                            <i className="mfb-component__child-icon zmdi zmdi-tag"/>
                                        </span>
                                    </li>
                                }
                                {this.isCustodianImportVisible() &&
                                    <li>
                                        <span onClick={this.showCustodianImportModal}
                                              data-mfb-label="New Import"
                                              className="clickable mfb-component__button--child">
                                            <i className="mfb-component__child-icon zmdi zmdi-file-text"/>
                                        </span>
                                    </li>
                                }
                                {this.isPerformanceHistoryModalVisible() &&
                                    <li>
                                        <span onClick={this.showPerformanceHistoryModal}
                                              data-mfb-label="New Performance History"
                                              className="clickable mfb-component__button--child">
                                            <i className="mfb-component__child-icon zmdi zmdi-file-text"/>
                                        </span>
                                    </li>
                                }
                                {this.isCompositesModalVisible() &&
                                    <li>
                                        <span onClick={this.showCompositeModal}
                                              data-mfb-label="New Composite"
                                              className="clickable mfb-component__button--child">
                                            <i className="mfb-component__child-icon zmdi zmdi-file-text"/>
                                        </span>
                                    </li>
                                }
                            </ul>
                        </li>
                    </ul>
                }
                {this.state.showHouseholdModal &&
                    <div style={{ display: (!!this.state.showHouseholdModal ? "inline" : "none") }}>
                        <CreateHouseholdDialog
                            onSave={(id) => { onRefreshView(); actions.push(`/folio/${id}?tab=Details&mode=Edit`); } }
                            onClose={() => { this.setState({ showHouseholdModal: false }); } } />
                    </div>
                }
                {this.state.showClientModal &&
                    <div style={{ display: (!!this.state.showClientModal ? "inline" : "none") }}>
                        <CreateClientDialog
                            onSave={(id) => { onRefreshView(); actions.push(`/folio/${id}?tab=Details&mode=Edit`); } }
                            onClose={() => { this.setState({ showClientModal: false }); } } />
                    </div>
                }
                {this.state.showAccountModal &&
                    <div style={{ display: (!!this.state.showAccountModal ? "inline" : "none") }}>
                        <CreateAccountDialog
                            onSave={(id) => { onRefreshView(); actions.push(`/folio/${id}?tab=Details&mode=Edit`); } }
                            onClose={() => { this.setState({ showAccountModal: false }); } } />
                    </div>
                }
                {this.state.showTransactionModal &&
                    <div style={{ display: (!!this.state.showTransactionModal ? "inline" : "none") }}>
                        <CreateTransactionDialog
                            onSave={(id) => onRefreshView()}
                            onClose={() => { this.setState({ showTransactionModal: false }); } } />
                    </div>
                }
                {this.state.showModelModal &&
                    <div style={{ display: (!!this.state.showModelModal ? "inline" : "none") }}>
                        <CreateModelDialog
                            onSave={(id) => {onRefreshView(); actions.push(`/model/${id}?tab=Details&mode=Edit`);}}
                            onClose={() => { this.setState({showModelModal : false}); }}/>
                    </div>
                }
                {this.state.showSecurityModal &&
                    <div style={{ display: (!!this.state.showSecurityModal ? "inline" : "none") }}>
                        <CreateSecurityDialog
                            onSave={(id) => {onRefreshView(); actions.push(`/security/${id}?tab=Details&mode=Edit`);}}
                            onClose={() => { this.setState({ showSecurityModal: false }); } } />
                    </div>
                }
                {this.state.showManagerModal &&
                    <div style={{ display: (!!this.state.showManagerModal ? "inline" : "none") }}>
                        <CreateManagerDialog
                            onSave={(id) => onRefreshView()}
                            onClose={() => { this.setState({ showManagerModal: false }); } } />
                    </div>
                }
                {this.state.showPriceModal &&
                    <div style={{ display: (!!this.state.showPriceModal ? "inline" : "none") }}>
                        <CreatePriceDialog
                            onSave={(id) => onRefreshView()}
                            onClose={() => { this.setState({ showPriceModal: false }); } } />
                    </div>
                }
                {this.state.showCreateFolderModal &&
                    <div style={{ display: (!!this.state.showCreateFolderModal ? "inline" : "none") }}>
                        <CreateFolderDialog
                            onSave={(id) => onRefreshView()}
                            parentFolderId={this.props.parentFolderId}
                            onClose={() => { this.setState({ showCreateFolderModal: false }); } } />
                    </div>
                }
                {this.state.showRoundingRuleModal &&
                    <div style={{ display: (!!this.state.showRoundingRuleModal ? "inline" : "none") }}>
                        <RoundingRuleDialog
                            onSave={(id) => { onRefreshView(); actions.push(`/rounding-rules/${id}?tab=Details&mode=Edit`);}}
                            onClose={() => { this.setState({ showRoundingRuleModal: false }); } } />
                    </div>
                }
                {this.state.showEquivalencyModal &&
                    <div style={{ display: (!!this.state.showEquivalencyModal ? "inline" : "none") }}>
                        <EquivalencyDialog
                            onSave={(id) => {onRefreshView(); actions.push(`/equivalency/${id}?tab=Details&mode=Edit`);}}
                            onClose={() => { this.setState({ showEquivalencyModal: false }); } } />
                    </div>
                }
                {this.state.showTradingRuleModal &&
                    <div style={{ display: (!!this.state.showTradingRuleModal ? "inline" : "none") }}>
                        <TradingRuleDialog
                            onSave={(id) => onRefreshView()}
                            onClose={() => { this.setState({ showTradingRuleModal: false }); } } />
                    </div>
                }
                {this.state.showBrokerModal &&
                    <div style={{ display: (!!this.state.showBrokerModal ? "inline" : "none") }}>
                        <BrokerDialog
                            onSave={(id) => {onRefreshView(); actions.push(`/broker/${id}?tab=Details&mode=Edit`);}}
                            onClose={() => { this.setState({ showBrokerModal: false }); } } />
                    </div>
                }
                {this.state.showFeeScheduleModal &&
                    <div style={{ display: (!!this.state.showFeeScheduleModal ? "inline" : "none") }}>
                        <FeeScheduleDialog
                            onSave={(id) => { actions.push(`/fee-schedule/${id}?mode=Edit`);}}
                            onClose={() => { this.setState({ showFeeScheduleModal: false }); } }
                        />
                    </div>
                }
                {this.state.showPayoutScheduleModal &&
                    <div style={{ display: (!!this.state.showPayoutScheduleModal ? "inline" : "none") }}>
                        <PayoutScheduleDialog
                            onSave={(id) => { actions.push(`/payout-schedule/${id}?mode=Edit`);}}
                            onClose={() => { this.setState({ showPayoutScheduleModal: false }); } }
                        />
                    </div>
                }
                {this.state.showAccountInvoiceModal &&
                    <div style={{ display: (!!this.state.showAccountInvoiceModal ? "inline" : "none") }}>
                        <InvoiceDialog
                            invoiceType="A"
                            onSave={(id) => onRefreshView()}
                            onClose={() => { this.setState({ showAccountInvoiceModal: false }); } } />
                    </div>
                }
                {this.state.showEntityInvoiceModal &&
                    <div style={{ display: (!!this.state.showEntityInvoiceModal ? "inline" : "none") }}>
                        <InvoiceDialog
                            invoiceType="E"
                            onSave={(id) => onRefreshView()}
                            onClose={() => { this.setState({ showEntityInvoiceModal: false }); } } />
                    </div>
                }
                {this.state.showCustomFieldModal &&
                    <div style={{ display: (!!this.state.showCustomFieldModal ? "inline" : "none") }}>
                        <EditCustomFieldsModal
                            fieldGroup={this.props.fieldGroup}
                            callingComponent={this.props.callingComponent}
                            onClose={() => { this.setState({ showCustomFieldModal: false }); } }
                        />
                    </div>
                }
                {this.state.showCustomGroupModal &&
                    <div style={{ display: (!!this.state.showCustomGroupModal ? "inline" : "none") }}>
                        <EditCustomGroupModal
                            callingComponent={this.props.callingComponent}
                            brokerStrategyId={this.props.fieldGroup && this.props.fieldGroup.brokerStrategyId
                                                || this.props.strategyId}
                            onClose={() => { this.setState({ showCustomGroupModal: false }); } }
                        />
                    </div>
                }
                {this.state.showCustodianImportModal &&
                    <div style={{ display: (!!this.state.showCustodianImportModal ? "inline" : "none") }}>
                        <CustodianImportDialog
                            onSave={this.onSaveCustodialImport}
                            onClose={this.onCloseImportModal} />
                    </div>
                }
                {this.state.showPerformanceHistoryModal &&
                    <div style={{ display: (!!this.state.showPerformanceHistoryModal ? "inline" : "none") }}>
                        <CreatePerformanceHistoryDialog
                            onSave={(id) => onRefreshView()}
                            onClose={() => { this.setState({ showPerformanceHistoryModal: false }); } } />
                    </div>
                }
                {this.state.showCompositeModal &&
                    <div style={{ display: (!!this.state.showCompositeModal ? "inline" : "none") }}>
                        <CreateCompositeDialog
                            onSave={(id) => { actions.push(`/composite/${id}?mode=Edit`);}}
                            onClose={() => { this.setState({ showCompositeModal: false }); } }
                        />
                    </div>
                }
                <div>
                    <DocumentUploader ref={me => this.documentUploader = me as any}
                        refreshView={onRefreshView}
                        folderItems={folderItems}
                        parentFolderId={this.props.parentFolderId} />
                </div>
            </div>
        );
    }
}

export const AddButtonComponent = connect(mapStateToProps, mapDispatchToProps)(AddButton);
