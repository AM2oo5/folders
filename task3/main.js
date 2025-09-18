const token = 'VqCuqVeFLV6sP6mgkp9B4LO_oQXPtq2Q'
const apiUrl = 'https://demo2.z-bit.ee/tasks'

// TODO checkbox ja texti muutmine

async function getMethod(apiUrl) {
  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer VqCuqVeFLV6sP6mgkp9B4LO_oQXPtq2Q`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error in GET request:', error);
    throw error;
  }
}


async function postMethod(apiUrl, data ) {
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer VqCuqVeFLV6sP6mgkp9B4LO_oQXPtq2Q`
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    return result;

  } catch (error) {
    console.error('Error in POST request:', error);
    throw error;
  }

}

async function putMethod(apiUrl, data) {
    try {
        const response = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json();

    } catch (error) {
        console.error('Error in PUT request:', error);
        throw error;
    }
}

async function deleteMethod(apiUrl) {
  try {
    const response = await fetch(apiUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer VqCuqVeFLV6sP6mgkp9B4LO_oQXPtq2Q`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error('Error in DELETE request:', error);
    throw error;
  }
}


const tasks = [];

let lastTaskId = 0;

let taskList;
let addTask;

// kui leht on brauseris laetud siis lisame esimesed taskid lehele
window.addEventListener('load', async () => {
  taskList = document.querySelector('#task-list');
  addTask = document.querySelector('#add-task');

  try {
    const getFetch = await getMethod(apiUrl);

    tasks.length = 0;
    tasks.push(...getFetch.map(taskData=> ({
      id: taskData.id,
      name: taskData.title,
      completed: taskData.marked_as_done
    })));

    
    tasks.forEach(renderTask);

  } catch (err) {
    console.error('Failed to load tasks from API:', err);
  }

    // kui nuppu vajutatakse siis lisatakse uus task
    addTask.addEventListener('click', async () => {

        const task = createTask(); // Teeme kõigepealt lokaalsesse "andmebaasi" uue taski
        const taskRow = createTaskRow(task); // Teeme uue taski HTML elementi mille saaks lehe peale listi lisada
        taskList.appendChild(taskRow); // Lisame taski lehele

        const apiPayload = {
      title: task.name,
      desc: ""
    };

    try {
      const result = await postMethod(apiUrl, apiPayload);
      console.log('Task saved to API:', result);

      task.id = result.id;
      task.completed = result.marked_as_done;
    } catch (err) {
      console.error('Failed to save task:', err);
    }
  });
});

function renderTask(task) {
    const taskRow = createTaskRow(task);
    taskList.appendChild(taskRow);
}

function createTask() {
    lastTaskId++;
    const task = {
        id: lastTaskId,
        name: 'Task ' + lastTaskId,
        completed: false
    };
    tasks.push(task);
    return task;
}

function debounce(updateApi, delay) {
    let timeout;
    return (...updatedData) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => updateApi(...updatedData), delay);
    }
}

function createTaskRow(task) {
    let taskRow = document.querySelector('[data-template="task-row"]').cloneNode(true);
    taskRow.removeAttribute('data-template');

    // Täidame vormi väljad andmetega
    const name = taskRow.querySelector("[name='name']");
    name.value = task.name;

    const checkbox = taskRow.querySelector("[name='completed']");
    checkbox.checked = task.completed;

     const updateTask = debounce(async () => {
        try {
            await putMethod(`${apiUrl}/${task.id}`, {

                title: task.name,
                marked_as_done: task.completed
            });
            console.log(`Task ${task.id} updated`);
        } catch (err) {
            console.error('Failed to update task:', err);
        }
    }, 500);

    name.addEventListener('input', (e) => {
        task.name = e.target.value;
        updateTask();
    });

    checkbox.addEventListener('change', (e) => {
        task.completed = e.target.checked;
        updateTask();
    });

    const deleteButton = taskRow.querySelector('.delete-task');
    deleteButton.addEventListener('click', async () => {
  try {
    
    await deleteMethod(`${apiUrl}/${task.id}`);
    console.log(`Task ${task.id} deleted from API`);

    taskList.removeChild(taskRow);
    tasks.splice(tasks.indexOf(task), 1);

  } catch (err) {
    console.error('Failed to delete task:', err);
  }
});

    // Valmistame checkboxi ette vajutamiseks
    hydrateAntCheckboxes(taskRow);

    return taskRow;
}


function createAntCheckbox() {
    const checkbox = document.querySelector('[data-template="ant-checkbox"]').cloneNode(true);
    checkbox.removeAttribute('data-template');
    hydrateAntCheckboxes(checkbox);
    return checkbox;
}

/**
 * See funktsioon aitab lisada eridisainiga checkboxile vajalikud event listenerid
 * @param {HTMLElement} element Checkboxi wrapper element või konteiner element mis sisaldab mitut checkboxi
 */
function hydrateAntCheckboxes(element) {
    const elements = element.querySelectorAll('.ant-checkbox-wrapper');
    for (let i = 0; i < elements.length; i++) {
        let wrapper = elements[i];

        // Kui element on juba töödeldud siis jäta vahele
        if (wrapper.__hydrated)
            continue;
        wrapper.__hydrated = true;


        const checkbox = wrapper.querySelector('.ant-checkbox');

        // Kontrollime kas checkbox peaks juba olema checked, see on ainult erikujundusega checkboxi jaoks
        const input = wrapper.querySelector('.ant-checkbox-input');
        if (input.checked) {
            checkbox.classList.add('ant-checkbox-checked');
        }
        
        // Kui inputi peale vajutatakse siis uuendatakse checkboxi kujundust
        input.addEventListener('change', () => {
            checkbox.classList.toggle('ant-checkbox-checked');
        });
    }
}