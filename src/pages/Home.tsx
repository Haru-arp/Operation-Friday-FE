import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { Responsive, WidthProvider, type Layouts } from "react-grid-layout";

const ResponsiveGridLayout = WidthProvider(Responsive);

const defaultLayouts: Layouts = {
    lg: [
        { i: "1", x: 0, y: 0, w: 3, h: 2, static: true },
        { i: "2", x: 3, y: 0, w: 3, h: 2, static: true },
    ],
};

const breakpoints = { lg: 1200 };
const cols = { lg: 12 };
export default function Home() {
    return (
        <>
            <div className="font-bold text-[18px] mb-[4px]">대시보드</div>
            <ResponsiveGridLayout className="layout" layouts={defaultLayouts} breakpoints={breakpoints} cols={cols} rowHeight={100} isResizable isDraggable useCSSTransforms>
                <div key="1" className="bg-blue-100 rounded shadow p-2">
                    <h2 className="text-center">Item 1</h2>
                </div>
                <div key="2" className="bg-green-100 rounded shadow p-2">
                    <h2 className="text-center">Item 2</h2>
                </div>
            </ResponsiveGridLayout>
        </>
    );
}
