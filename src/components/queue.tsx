import { patch } from '@mui/material';
import { createRoot, Container  } from 'react-dom/client';

function getNumberOfTracksInQueue(parent: HTMLElement):number {
    return parent.children.length;
}

// Removes all tracks before selected track in queue and plays track in media player
function skipToTrack(trackObject: Record<string, string>, childTrack: HTMLElement, parent: HTMLElement) {
    let currentChild = parent.firstChild;

    while (currentChild && currentChild !== childTrack) {
        const nextChild = currentChild.nextSibling;
        parent.removeChild(currentChild);
        currentChild = nextChild;
    }
    window.parent.postMessage({ type: 'SKIP_TO_TRACK', payload: trackObject }, '*');
}

export async function addToQueue(trackObject: Record<string, string>, result: React.JSX.Element) {
    const artist    = trackObject.artist;
    const title     = trackObject.title;
    const album     = trackObject.album;
    const artwork   = trackObject.artwork;
    const urn       = trackObject.urn;
    const trackUrl  = trackObject.trackUrl;
    const duration  = trackObject.duration;

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
        childNode.onclick = () => {
            skipToTrack(trackObject, childNode, parent);
        }
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
            {children}
        </div>
    );
}