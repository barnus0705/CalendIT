import * as React from 'react';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { ViewState, EditingState, IntegratedEditing } from '@devexpress/dx-react-scheduler';
import {
    Scheduler,
    WeekView,
    Appointments,
    AppointmentForm,
    AppointmentTooltip,
    DragDropProvider, ViewSwitcher, DayView, Toolbar, MonthView, DateNavigator, TodayButton,
} from '@devexpress/dx-react-scheduler-material-ui';
import UserContext from "../Auth/UserContext.jsx";



const PREFIX = 'calendar';
export const classes = {
    container: `${PREFIX}-container`,
    text: `${PREFIX}-text`,
    formControlLabel: `${PREFIX}-formControlLabel`,
};
const currentDate = new Date().toISOString().split('T')[0];

export default ({ data, setData }) => {
    //const [data, setData] = React.useState([]);
    const { user } = React.useContext(UserContext);

    React.useEffect(() => {

        if (!user) return;
        // after auth is done, write `` instead of ''
        fetch(`http://localhost:5000/events/${user.ID}`).then(response => response.json())
            .then(calendarData => {
                const userData = calendarData.map(responseData => {
                   return {
                       title: responseData.title,
                       notes: responseData.notes,
                       id: responseData.event_id,
                       endDate: new Date(responseData.end_date),
                       startDate: new Date(responseData.start_date),
                       allDay: null,
                       rRule: null
                   };
                });
                console.log(userData);
                setData(userData)
            });
    }, [user]);


    const [editingOptions, setEditingOptions] = React.useState({
        allowAdding: true,
        allowDeleting: true,
        allowUpdating: true,
        allowDragging: true,
        allowResizing: true,
    });

    const {
        allowAdding, allowDeleting, allowUpdating, allowResizing, allowDragging,
    } = editingOptions;

    const onCommitChanges = React.useCallback( async ({ added, changed, deleted }) => {
        if (added) {
            console.log(added.startDate);
            console.log(added.endDate);
            added.id = user.ID;
            const response = await fetch("http://localhost:5000/events/add", {
                method:"post",
                body:JSON.stringify(added),
                headers:{
                    "Content-Type" : "application/json",
                    "Accept" : "application/json"
                }
            });
            const responseData = await response.json();
            setData([...data, {
                title: responseData.title,
                notes: responseData.notes,
                id: responseData.event_id,
                endDate: new Date(responseData.end_date),
                startDate: new Date(responseData.start_date),
                allDay: null,
                rRule: null
            }]);
        }
        if (changed) {
            console.log(changed)
            await fetch("http://localhost:5000/events/change", {
                method:"post",
                body:JSON.stringify(changed),
                headers:{
                    "Content-Type" : "application/json",
                    "Accept" : "application/json"
                }
            });

            setData(data.map(appointment => (
                changed[appointment.id] ? { ...appointment, ...changed[appointment.id] } : appointment)));
        }
        if (deleted) {
            await fetch("http://localhost:5000/events/" + deleted , {
                method: "DELETE"
            });

            setData(data.filter(appointment => appointment.id !== deleted));
        }
    }, [setData, data]);

    const TimeTableCell = React.useCallback(React.memo(({ onDoubleClick, ...restProps }) => (
        <WeekView.TimeTableCell
            {...restProps}
            onDoubleClick={allowAdding ? onDoubleClick : undefined}
        />
    )), [allowAdding]);

    const CommandButton = React.useCallback(({ id, ...restProps }) => {
        if (id === 'deleteButton') {
            return <AppointmentForm.CommandButton id={id} {...restProps} disabled={!allowDeleting} />;
        }
        return <AppointmentForm.CommandButton id={id} {...restProps} />;
    }, [allowDeleting]);

    const allowDrag = React.useCallback(
        () => allowDragging && allowUpdating,
        [allowDragging, allowUpdating],
    );
    const allowResize = React.useCallback(
        () => allowResizing && allowUpdating,
        [allowResizing, allowUpdating],
    );

    return (
        <Paper>
            <Scheduler data={data} height={700}>
                <ViewState defaultCurrentViewName={"Week"}
                           defaultCurrentDate={currentDate}
                />

                <EditingState onCommitChanges={onCommitChanges} />

                <IntegratedEditing />

                <DayView startDayHour={0} endDayHour={24}  />
                <WeekView startDayHour={0} endDayHour={24} timeTableCellComponent={TimeTableCell} />
                <MonthView />

                <Toolbar />
                <DateNavigator />
                <TodayButton />
                <ViewSwitcher />
                <Appointments />

                <AppointmentTooltip showOpenButton showDeleteButton={allowDeleting} />
                <AppointmentForm commandButtonComponent={CommandButton} />
                <DragDropProvider allowDrag={allowDrag} allowResize={allowResize} />
            </Scheduler>
        </Paper>
    );
};
