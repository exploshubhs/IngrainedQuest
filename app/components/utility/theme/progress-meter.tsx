import { Props, Component, PropTypes } from "react";

interface ProgressMeterProps extends Props<ProgressMeterMain> {
    classCount?: any;
    size?: number;
}

interface ProgressMeterState {

}

export class ProgressMeterMain extends Component<ProgressMeterProps, ProgressMeterState> {

    static contextTypes: React.ValidationMap<any> = {
        "primaryColor": PropTypes.string.isRequired,
    };
    context: AppModels.Context;

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.redraw();
    }

    componentDidUpdate() {
        this.redraw();
    }

    redraw() {
        ($(".main-pie") as any).easyPieChart({
            trackColor: "rgba(0,0,0,0.05)",
            scaleColor: "rgba(0, 0, 0, 0.2)",
            barColor: this.context.primaryColor,
            lineWidth: 6,
            lineCap: "butt",
            size: this.props.size || 70,
        });
    };

    render() {
        const {classCount, key} = this.props;
        return (
            <div
                key={key}
                className={"easy-pie main-pie text-right" +
                    (( classCount.total3 === 0 && classCount.total2 === 0) ||
                    (Number((classCount.total2 / classCount.total3 * 100)) <= 0) ? " hidden" : " show") }
                data-percent={classCount.total2 / classCount.total3 * 100}>
                { classCount.total2 > 0 && classCount.total3 === classCount.total2 ?
                    <div>
                        <div className="check-percent" style={{right:"27px"}}>
                            <i className="zmdi zmdi-check" />
                        </div>
                        <div
                            className="pie-title table-text-opacity p-r-15"
                            style={{textAlign: "right"}}
                        >
                            assigned
                        </div>
                    </div>
                    :
                    <div>
                        <div className="percent" style={{textAlign: "right"}}>
                            <strong>{(classCount.total2 / classCount.total3 * 100).toFixed(0)}</strong>
                        </div>
                        <div className="pie-title"
                             style={{textAlign: "right"}}>{classCount.total3 - classCount.total2} to assign
                        </div>
                    </div>
                }
            </div>
        );
    }
}
