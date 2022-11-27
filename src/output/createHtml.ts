import {Chunk} from "../chunk/Chunk";
import {ChunkType} from "../chunk/ChunkType";

const el = (tag: string, children: Node[], ...classes: string[]): HTMLElement => {
	const el = document.createElement(tag);
	el.append(...children)
	el.addClasses(classes);
	return el;
};

const div = (children: Node[], ...classes: string[]): HTMLElement => el('div', children, ...classes);
const text = (content: string | null): Text => document.createTextNode(content || "");
const stack = (chord: HTMLElement, text: HTMLElement): HTMLElement => div([chord, text], 'stack');
const chord = (content: string | null): HTMLElement => div([text(content)], 'chord', 'cm-strong');
const header = (content: string | null): HTMLElement => div([text(content)], 'header');
const word = (content: string | null): HTMLElement => div([text(content)], 'word');
const line = (children: HTMLElement[]): HTMLElement => div(children, 'line');
const chordWithText = (c: string | null, t: string | null): HTMLElement => stack(chord(c), word(t));

const chunks = (chunk: Chunk): HTMLElement => {
	switch (chunk.chunkType) {
		case ChunkType.Empty: return word(chunk.content);
		case ChunkType.Header: return header(chunk.content);
		case ChunkType.Word: return word(chunk.content);
		case ChunkType.Chord: return chord(chunk.content);
		case ChunkType.ChordWithText: return chordWithText(chunk.content, chunk.content2);
	}
}

const lines = (group: Chunk[]): HTMLElement => line(group.map(c => chunks(c)));
const root = (lines: HTMLElement[]): HTMLElement => el('pre', lines, 'root');
export default (groups: Chunk[][]): HTMLElement => root(groups.map(g => lines(g)));