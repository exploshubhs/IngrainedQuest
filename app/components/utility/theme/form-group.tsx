import {Props, Component} from "react";

interface FormGroupProps extends Props<FormGroup> {

}

interface FormGroupState {

}

export class FormGroup extends Component<FormGroupProps, FormGroupState> {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <div className="form-group fg-float">
                {this.props.children}
            </div>
        );
    }
}