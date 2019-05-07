import { Props, Component } from "react";

interface ConfirmNavigationModalProps extends Props<ConfirmNavigationModal> {
    showConfirmNavigationModal?: boolean;
    onYesBtnClick?: __React.MouseEventHandler;
    onNoBtnClick?: __React.MouseEventHandler;
    onCancelBtnClick?: __React.MouseEventHandler;
    headerText?: string;
    promptText?: string;
    yesText?: string;
    noText?: string;
    cancelText?: string;
}

interface ConfirmNavigationModalState {
}

export class ConfirmNavigationModal extends Component<ConfirmNavigationModalProps, ConfirmNavigationModalState> {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div style={{ display: (!!this.props.showConfirmNavigationModal ? "inline" : "none") }}>

                <div onClick={this.props.onNoBtnClick}
                     className="sweet-overlay"
                     tabIndex={-1}
                     style={{ opacity: 1.02, display: "block" }}>
                </div>
                <div className="sweet-alert sweet-alert-override showSweetAlert"
                     tabIndex={-1}
                     data-has-cancel-button="false"
                     data-has-confirm-button="true"
                     data-allow-ouside-click="false"
                     data-has-done-function="false"
                     data-timer="null"
                     style={{
                                display: "block", top: "20%", marginTop: "0px", overflow: "visible", position: "fixed",
                                width: "40%", left: "0px", marginLeft: "30%",
                            }}>
                    <div>
                        <h2>{this.props.headerText || "Confirm"}</h2>
                        <p>
                            {this.props.promptText ||
                                "Would you like to save your changes first? If not your changes will be lost."}
                        </p>

                        <div className="row m-t-20" style={{ marginRight: "-5px" }}>
                            {this.props.onNoBtnClick &&
                                <button onClick={this.props.onNoBtnClick}
                                        className="btn btn-primary waves-effect m-5 pull-right">
                                    {this.props.noText || "Save Changes"}
                                </button>
                            }
                            <button onClick={this.props.onYesBtnClick}
                                    className="btn btn-default waves-effect m-5 pull-right">
                                {this.props.yesText || "Discard Changes"}
                            </button>
                            {this.props.onCancelBtnClick &&
                                <button onClick={this.props.onCancelBtnClick}
                                        className="btn btn-default waves-effect m-5 pull-right">
                                    {this.props.cancelText || "Cancel"}
                                </button>
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
