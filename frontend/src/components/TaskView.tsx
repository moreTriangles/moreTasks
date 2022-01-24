import { Box, Container, Stack, Toolbar, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { Tag } from "../entities/Tag"
import { Task } from "../entities/Task"
import { TaskInputBox } from "./TaskInputBox"
import { TaskItem } from "./TaskItem"

type TaskViewProps = {
    tasks: Task[]
    tags: Tag[]
    handleSubmitNewTask: (newTask: Task) => void
}

export const TaskView = (props: TaskViewProps) => {

    const [groupedTasks, setGroupedTasks] = useState<Map<String, Task[]>>(new Map<String, Task[]>());

    const getTasksGroupedByDate = (tasks: Task[]) : Map<String, Task[]> => {
        // Sort tasks by date, and ensures all tasks with no date will go to the end
        tasks.sort((task1, task2) => {
            const date1 = task1.date === undefined ? Number.MAX_VALUE : new Date(task1.date).valueOf()
            const date2 = task2.date === undefined ? Number.MAX_VALUE : new Date(task2.date).valueOf()
            return date1 - date2;
        })
        const groupedTasks = new Map<String, Task[]>()
        tasks.map(task => {
            const date = task.date === undefined ? "No Date" : task.date.toDateString()
            let taskArray = groupedTasks.get(date)
            if (!taskArray) {
                taskArray = []
                groupedTasks.set(date, taskArray)
            }
            taskArray.push(task)
        })
        return groupedTasks
    }

    // Group tasks into dates
    useEffect(() => {
        setGroupedTasks(getTasksGroupedByDate(props.tasks))
    }, [])

    return (
        <Container sx={{ py: 3 }} maxWidth="sm">
            <Toolbar />
            <TaskInputBox options={props.tags} handleSubmitNewTask={props.handleSubmitNewTask}/>
            <br />
            {Array.from(groupedTasks.keys()).map(date => {
                let taskArray = groupedTasks.get(date)
                if (!taskArray) {
                    taskArray = []
                }
                return (
                    <Box>
                        <Typography sx={{ marginTop: 2 }} variant="h5">{date}</Typography>
                        <Stack spacing={1}>
                            {taskArray.map((task, index) => <TaskItem task={task} key={index} />)}
                        </Stack>
                    </Box>
                )
            })}
        </Container>
    )
}