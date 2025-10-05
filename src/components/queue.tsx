import { createRoot, Container  } from 'react-dom/client';
import generateResult from './searchResults';

function removeFromQueue(child: HTMLElement, parent: HTMLElement) {
    // Check if both elements exist before attempting removal
    if (child && parent) {
        parent.removeChild(child);
    }
}

function getNumberOfTracksInQueue(parent: HTMLElement):number {
    return parent.children.length;
}

// Removes all tracks before selected track in queue and plays track in media player
export function skipToTrack(trackObject: Record<string, string>, childTrack: HTMLElement, parent: HTMLElement) {
    let currentChild = parent.firstChild;

    // Removes all songs before selected song from queue
    while (currentChild && currentChild !== childTrack) {
        const nextChild = currentChild.nextSibling;
        parent.removeChild(currentChild);
        currentChild = nextChild;
    }

    // Removes selected song from queue
    if (currentChild) {
        parent.removeChild(currentChild);
    }
    window.parent.postMessage({ type: 'SKIP_TO_TRACK', payload: trackObject }, '*');
}


// Used to detect if user clicks proper area to either add or remove a song from a queue
function notRemoving(target: HTMLElement) {
    if (
        target?.classList.contains('MuiPaper-root') ||
        target?.classList.contains('MuiPaper-elevation') ||
        target?.classList.contains('MuiPaper-rounded') ||
        target?.classList.contains('MuiPaper-elevation1') ||
        target?.classList.contains('trackMetadataParent') ||
        target?.classList.contains('css-16carsw-MuiPaper-root') ||
        target?.classList.contains('MuiGrid-root') ||
        target?.classList.contains('MuiGrid-direction-xs-row') ||
        target?.classList.contains('MuiGrid-grid-xs-10') ||
        target?.classList.contains('css-r13beu-MuiGrid-root') ||
        target?.classList.contains('MuiPaper-root') ||
        target?.classList.contains('MuiPaper-elevation') ||
        target?.classList.contains('MuiPaper-rounded') ||
        target?.classList.contains('MuiPaper-elevation1') ||
        target?.classList.contains('logoParent') ||
        target?.classList.contains('css-esa9er-MuiPaper-root') ||
        target?.classList.contains('MuiGrid-root') ||
        target?.classList.contains('MuiGrid-direction-xs-row') ||
        target?.classList.contains('MuiGrid-grid-xs-2') ||
        target?.classList.contains('css-15bfe7d-MuiGrid-root') ||
        target?.classList.contains('Platform') ||
        target?.classList.contains('SoundCloud')
    ) 
    {
        return true;
    }
    return false;
}

export async function addToQueue(trackObject: Record<string, string>) {
    const result = generateResult("SoundCloud", trackObject, true);
    const parent  = document.getElementById("queueParent");
    
    let childrenCount;
    // Get number of tracks already in the queue
    if(parent) {
        childrenCount = getNumberOfTracksInQueue(parent);
    } 

    // Creates a child node to render result onto
    const childNode = await document.createElement('div');
    childNode.id = `Queue Slot ${childrenCount}`;

    if (parent && childNode) {
        // Sets clickable areas (left: skip to song from queue to be played) (right and specifically the remove button: removes a song from the queue)
        childNode.addEventListener('click', (event: MouseEvent) => {
            const target = event.target as HTMLElement;            
            if (notRemoving(target)) {
                skipToTrack(trackObject, childNode, parent);
            }
            else {
                removeFromQueue(childNode, parent);
            }
        });
    }

    if (parent) {
        parent.appendChild(childNode);
    }

    const child = createRoot(document.getElementById(`Queue Slot ${childrenCount}`) as Container);
    child.render(result);
}

interface QueueProps{
    children?: React.ReactNode;
};

export default function Queue({children}: QueueProps) {
    return(
        <div id='queueParent'>
            <h1>Queue</h1>
            {children}
        </div>
    );
}