import { Props, Component } from "react";
import { ModalWrapper } from "components/utility/modal-wrapper";
import { TextInputFloatingEditable } from "components/utility/theme/text-input-floating-editable";

interface AddDashboardTabDialogProps extends Props<AddDashboardTabDialog> {
    name?: string;
    onClose: () => void;
    onSubmit: (name: string) => any;
}

interface AddDashboardTabDialogState {
    errorInputText?: string;
}

export class AddDashboardTabDialog extends Component<AddDashboardTabDialogProps, AddDashboardTabDialogState> {

    nameInput: TextInputFloatingEditable;

    constructor(props) {
        super(props);
        this.state = {
            errorInputText: "",
        };
    }

    componentDidMount() {
        this.nameInput.setFocus();
    };

    close = () => {
        this.props.onClose();
    };

    submit = (e) => {
        e.preventDefault();
        const nameText = this.nameInput.getValue();
        if (nameText && nameText.length > 0) {
            const {onSubmit} = this.props;
            if (onSubmit) {
                onSubmit(nameText);
            }
        } else {
            this.setState({
                errorInputText: "Portal tab name cannot be empty",
            });
        }
    };

    render() {
        const {name} = this.props;
        const {errorInputText} = this.state;
        const errorTextStyle = {
            color: "#F44336",
            margin: "0px",
        };
        return (
            <ModalWrapper width="400px" onClose={this.close}>
                <form onSubmit={this.submit}>
                    <div className="pull-right">
                        <i onClick={this.close}
                           style={{ cursor: "pointer" }}
                           className="zmdi zmdi-hc-2x zmdi-close"/>
                    </div>
                    <h2 style={{ margin: "10px 0px 20px 0px" }} className="title pull-left">
                        <span>{name ? "Update Tab" : "Create Tab"}</span>
                    </h2>
                    <div className="form-group" style={{ display: "block", marginBottom: "2em" }}>
                        <div className="row">
                            <div className="col-sm-12 fg-float">
                                <TextInputFloatingEditable
                                    ref={r => this.nameInput = r}
                                    initialText={name}
                                    labelText="Tab Name"
                                    placeholder="" />
                                {errorInputText.length > 0 && <p style={errorTextStyle}>{errorInputText}</p>}
                            </div>
                        </div>
                    </div>
                    <div className="form-group" style={{ display: "block", textAlign: "right" }}>
                        <div style={{ display: "inline-block", marginTop: "30px" }}>
                            <span className="btn btn-default"
                                  style={{ marginRight: "5px" }}
                                  onClick={this.close}>
                                Cancel
                            </span>
                            <span className="btn btn-primary"
                                  onClick={this.submit}>
                                OK
                            </span>
                        </div>
                        { /*To handle submit on enter*/ }
                        <input type="submit" className="hidden-button" />
                    </div>
                </form>
            </ModalWrapper>
        );
    }
}
