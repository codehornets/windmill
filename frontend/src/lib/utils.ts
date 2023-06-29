// /* eslint-disable @typescript-eslint/explicit-module-boundary-types */
// import { goto } from '$app/navigation'
// import { AppService, type Flow, FlowService, Script, ScriptService, type User } from '$lib/gen'
// import { toast } from '@zerodevx/svelte-toast'
// import type { Schema, SupportedLanguage } from './common'
// import { hubScripts, type UserExt, workspaceStore } from './stores'
// import { page } from '$app/stores'
// import { get } from 'svelte/store'

import type { UserExt } from './stores'
import { sendUserToast } from './toast'
export { sendUserToast }

export function validateUsername(username: string): string {
	if (username != '' && !/^\w+$/.test(username)) {
		return 'username can only contain letters and numbers'
	} else {
		return ''
	}
}

export function parseQueryParams(url: string | undefined) {
	if (!url) return {}
	const index = url.indexOf('?')
	if (index == -1) return {}
	const paramArr = url?.slice(index + 1)?.split('&')
	const params: Record<string, string> = {}
	paramArr?.map((param) => {
		const [key, val] = param.split('=')
		params[key] = decodeURIComponent(val)
	})
	return params
}

export function isToday(someDate: Date): boolean {
	const today = new Date()
	return (
		someDate.getDate() == today.getDate() &&
		someDate.getMonth() == today.getMonth() &&
		someDate.getFullYear() == today.getFullYear()
	)
}

export function daysAgo(someDate: Date): number {
	const today = new Date()
	return Math.floor((today.getTime() - someDate.getTime()) / 86400000)
}

export function secondsAgo(date: Date) {
	return Math.max(0, Math.floor((new Date().getTime() - date.getTime()) / 1000))
}

export function displayDaysAgo(dateString: string): string {
	const date = new Date(dateString)
	const nbSecondsAgo = secondsAgo(date)
	if (nbSecondsAgo < 600) {
		return `${nbSecondsAgo}s ago`
	} else if (isToday(date)) {
		return `today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
	} else {
		let dAgo = daysAgo(date)
		if (dAgo == 0) {
			return `yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
		} else if (dAgo > 7) {
			return `${dAgo + 1} days ago at ${date.toLocaleTimeString([], {
				hour: '2-digit',
				minute: '2-digit'
			})}`
		} else {
			return displayDate(dateString)
		}
	}
}

export function displayDate(dateString: string | Date | undefined, displaySecond = false): string {
	const date = new Date(dateString ?? '')
	if (date.toString() === 'Invalid Date') {
		return ''
	} else {
		return `${date.toLocaleTimeString([], {
			hour: '2-digit',
			minute: '2-digit',
			second: displaySecond ? '2-digit' : undefined
		})} ${date.getDate()}/${date.getMonth() + 1}`
	}
}

export function msToSec(ms: number | undefined): string {
	if (ms === undefined) return '?'
	return (ms / 1000).toLocaleString(undefined, { maximumFractionDigits: 3 })
}

export function getToday() {
	var today = new Date()
	return today
}

export function truncateHash(hash: string): string {
	if (hash.length >= 6) {
		return hash.substr(hash.length - 6)
	} else {
		return hash
	}
}

export function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms))
}

export function validatePassword(password: string): boolean {
	const re = /^(?=.*[\d])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,30}$/
	return re.test(password)
}

export function clickOutside(node: Node): { destroy(): void } {
	const handleClick = (event: MouseEvent) => {
		if (node && !node.contains(<HTMLElement>event.target) && !event.defaultPrevented) {
			node.dispatchEvent(new CustomEvent<MouseEvent>('click_outside', { detail: event }))
		}
	}

	document.addEventListener('click', handleClick, true)

	return {
		destroy() {
			document.removeEventListener('click', handleClick, true)
		}
	}
}

export interface DropdownItem {
	// If a DropdownItem has an action, it will be declared as a button
	// If a DropdownItem has no action and an href, it will be declared as a link
	// If a DropdownItem has no action and no href, it will be created as a text line
	displayName: string
	eventName?: string //the event to send when clicking this item
	action?: ((event?: MouseEvent) => Promise<void>) | ((event?: MouseEvent) => void)
	href?: string
	separatorTop?: boolean
	separatorBottom?: boolean
	type?: 'action' | 'delete'
	disabled?: boolean
	icon?: any | undefined
}

export const DELETE = 'delete' as 'delete'

export function emptySchema() {
	return {
		$schema: 'https://json-schema.org/draft/2020-12/schema' as string | undefined,
		properties: {},
		required: [],
		type: 'object'
	}
}

export function simpleSchema() {
	return {
		$schema: 'https://json-schema.org/draft/2020-12/schema',
		type: 'object',
		properties: {
			name: {
				description: 'The name to hello world to',
				type: 'string'
			}
		},
		required: []
	}
}

export function removeItemAll<T>(arr: T[], value: T) {
	var i = 0
	while (i < arr.length) {
		if (arr[i] === value) {
			arr.splice(i, 1)
		} else {
			++i
		}
	}
	return arr
}

export function emptyString(str: string | undefined | null): boolean {
	return str === undefined || str === null || str === ''
}

export function defaultIfEmptyString(str: string | undefined, dflt: string): string {
	return emptyString(str) ? dflt : str!
}

export function removeKeysWithEmptyValues(obj: any): any {
	Object.keys(obj).forEach((key) => (obj[key] === undefined ? delete obj[key] : {}))
}

export function allTrue(dict: { [id: string]: boolean }): boolean {
	return Object.values(dict).every(Boolean)
}

function subtractSeconds(date: Date, seconds: number): Date {
	date.setSeconds(date.getSeconds() - seconds)
	return date
}

export function forLater(scheduledString: string): boolean {
	return new Date() < subtractSeconds(new Date(scheduledString), 5)
}

export function elapsedSinceSecs(date: string): number {
	return Math.round((new Date().getTime() - new Date(date).getTime()) / 1000)
}

export function pathIsEmpty(path: string): boolean {
	return path == undefined || path.split('/')[2] == ''
}

export function encodeState(state: any): string {
	return btoa(encodeURIComponent(JSON.stringify(state)))
}

export function decodeState(query: string): any {
	return JSON.parse(decodeURIComponent(atob(query)))
}

export function decodeArgs(queryArgs: string | undefined): any {
	if (queryArgs) {
		const parsed = decodeState(queryArgs)
		Object.entries(parsed).forEach(([k, v]) => {
			if (v == '<function call>') {
				parsed[k] = undefined
			}
		})
		return parsed
	}
	return {}
}

let debounced: NodeJS.Timeout | undefined = undefined
export function setQueryWithoutLoad(
	url: URL,
	args: { key: string; value: string | null | undefined }[],
	bounceTime?: number
): void {
	debounced && clearTimeout(debounced)
	debounced = setTimeout(() => {
		const nurl = new URL(url.toString())
		for (const { key, value } of args) {
			if (value) {
				nurl.searchParams.set(key, value)
			} else {
				nurl.searchParams.delete(key)
			}
		}

		try {
			history.replaceState(history.state, '', nurl.toString())
		} catch (e) {
			console.error(e)
		}
	}, bounceTime ?? 200)
}

export function groupBy<T>(
	scripts: T[],
	toGroup: (t: T) => string,
	dflts: string[] = []
): [string, T[]][] {
	let r: Record<string, T[]> = {}
	for (const dflt of dflts) {
		r[dflt] = []
	}

	scripts.forEach((sc) => {
		let section = toGroup(sc)
		if (section in r) {
			r[section].push(sc)
		} else {
			r[section] = [sc]
		}
	})

	return Object.entries(r).sort((s1, s2) => {
		let n1 = s1[0]
		let n2 = s2[0]

		if (n1 > n2) {
			return 1
		} else if (n1 < n2) {
			return -1
		} else {
			return 0
		}
	})
}

export function removeMarkdown(text: string): string {
	return text.replace(/[[\*|\-|#\_]/g, '')
}
export function truncate(s: string, n: number, suffix: string = '...'): string {
	if (!s) {
		return ''
	}
	if (s.length <= n) {
		return s
	} else {
		return s.substring(0, n) + suffix
	}
}

export function truncateRev(s: string, n: number, prefix: string = '...'): string {
	if (!s) {
		return prefix
	}
	if (s.length <= n) {
		return s
	} else {
		return prefix + s.substring(s.length - n, s.length)
	}
}

export function isString(value: any) {
	return typeof value === 'string' || value instanceof String
}

export type InputCat =
	| 'string'
	| 'number'
	| 'boolean'
	| 'list'
	| 'resource-object'
	| 'enum'
	| 'date'
	| 'base64'
	| 'resource-string'
	| 'object'
	| 'sql'
	| 'yaml'

export function setInputCat(
	type: string | undefined,
	format: string | undefined,
	itemsType: string | undefined,
	enum_: any,
	contentEncoding: string | undefined
): InputCat {
	if (type === 'number' || type === 'integer') {
		return 'number'
	} else if (type === 'boolean') {
		return 'boolean'
	} else if (type == 'array' && itemsType != undefined) {
		return 'list'
	} else if (type == 'object' && format?.startsWith('resource')) {
		return 'resource-object'
	} else if (!type || type == 'object' || type == 'array') {
		return 'object'
	} else if (type == 'string' && enum_) {
		return 'enum'
	} else if (type == 'string' && format == 'date-time') {
		return 'date'
	} else if (type == 'string' && format == 'sql') {
		return 'sql'
	} else if (type == 'string' && format == 'yaml') {
		return 'yaml'
	} else if (type == 'string' && contentEncoding == 'base64') {
		return 'base64'
	} else {
		return 'string'
	}
}

export function formatCron(inp: string): string {
	// Allow for cron expressions inputted by the user to omit month and year
	let splitted = inp.split(' ')
	splitted = splitted.filter(String) //remove empty string elements
	if (6 - splitted.length > 0) {
		return splitted.concat(Array(6 - splitted.length).fill('*')).join(' ')
	} else {
		return inp
	}
}

export function classNames(...classes: Array<string | undefined>): string {
	return classes.filter(Boolean).join(' ')
}

export async function copyToClipboard(value?: string, sendToast = true): Promise<boolean> {
	if (!value) {
		return false
	}

	let success = false
	if (navigator?.clipboard) {
		success = await navigator.clipboard
			.writeText(value)
			.then(() => true)
			.catch(() => false)
	}
	sendToast &&
		sendUserToast(success ? 'Copied to clipboard!' : "Couldn't copy to clipboard", !success)
	return success
}

export function pluralize(quantity: number, word: string, customPlural?: string) {
	if (quantity <= 1) {
		return `${quantity} ${word}`
	} else if (customPlural) {
		return `${quantity} ${customPlural}}`
	} else {
		return `${quantity} ${word}s`
	}
}

export function capitalize(word: string): string {
	return word ? word.charAt(0).toUpperCase() + word.slice(1) : ''
}

export function addWhitespaceBeforeCapitals(word?: string): string {
	if (!word) {
		return ''
	}
	return word.replace(/([A-Z])/g, ' $1').trim()
}

export function isObject(obj: any) {
	return typeof obj === 'object'
}

export function debounce(func: (...args: any[]) => any, wait: number) {
	let timeout: any
	return function (...args: any[]) {
		// @ts-ignore
		const context = this
		clearTimeout(timeout)
		timeout = setTimeout(() => func.apply(context, args), wait)
	}
}

export function throttle<T>(func: (...args: any[]) => T, wait: number) {
	let timeout: any
	return function (...args: any[]) {
		if (!timeout) {
			timeout = setTimeout(() => {
				timeout = null
				// @ts-ignore
				func.apply(this, args)
			}, wait)
		}
	}
}

export function isMac(): boolean {
	return navigator.userAgent.indexOf('Mac OS X') !== -1
}

export function getModifierKey(): string {
	return isMac() ? '⌘' : 'Ctrl'
}

export function isValidHexColor(color: string): boolean {
	return /^#(([A-F0-9]{2}){3,4}|[A-F0-9]{3})$/i.test(color)
}

export function sortObject<T>(o: T & object): T {
	return Object.keys(o)
		.sort()
		.reduce((obj, key) => {
			obj[key] = o[key]
			return obj
		}, {}) as T
}

export function generateRandomString(len: number = 24): string {
	let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
	let result = ''

	for (let i = 0; i < len; i++) {
		result += chars.charAt(Math.floor(Math.random() * chars.length))
	}

	return result
}

export function deepMergeWithPriority<T>(target: T, source: T): T {
	if (typeof target !== 'object' || typeof source !== 'object') {
		return source
	}

	const merged = { ...target }

	for (const key in source) {
		if (source.hasOwnProperty(key) && merged?.hasOwnProperty(key)) {
			if (target?.hasOwnProperty(key)) {
				merged[key] = deepMergeWithPriority(target[key], source[key])
			} else {
				merged[key] = source[key]
			}
		}
	}

	return merged
}

export function canWrite(
	path: string,
	extra_perms: Record<string, boolean>,
	user?: UserExt
): boolean {
	if (user?.is_admin || user?.is_super_admin) {
		return true
	}
	let keys = Object.keys(extra_perms)
	if (!user) {
		return false
	}
	if (isObviousOwner(path, user)) {
		return true
	}
	let userOwner = `u/${user.username}`
	if (keys.includes(userOwner) && extra_perms[userOwner]) {
		return true
	}
	if (user.pgroups.findIndex((x) => keys.includes(x) && extra_perms[x]) != -1) {
		return true
	}
	if (user.folders.findIndex((x) => path.startsWith('f/' + x)) != -1) {
		return true
	}

	return false
}

export function isOwner(
	path: string,
	user: UserExt | undefined,
	workspace: string | undefined
): boolean {
	if (!user || !workspace) {
		return false
	}
	if (user.is_super_admin) {
		return true
	}
	if (workspace == 'admin') {
		return false
	} else if (user.is_admin) {
		return true
	} else if (path.startsWith('u/' + user.username + '/')) {
		return true
	} else if (path.startsWith('f/')) {
		return user.folders_owners.some((x) => path.startsWith('f/' + x + '/'))
	} else {
		return false
	}
}

export function isObviousOwner(path: string, user?: UserExt): boolean {
	if (!user) {
		return false
	}
	if (user.is_admin || user.is_super_admin) {
		return true
	}
	let userOwner = `u/${user.username}`
	if (path.startsWith(userOwner)) {
		return true
	}
	if (user.pgroups.findIndex((x) => path.startsWith(x)) != -1) {
		return true
	}
	if (user.folders.findIndex((x) => path.startsWith('f/' + x)) != -1) {
		return true
	}
	return false
}
