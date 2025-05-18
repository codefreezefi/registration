import { Show } from 'solid-js'
import { Collapsible } from '../Collapsible.tsx'
import { useRegistration } from '../context/Registration.tsx'

export const InvitationLetter = () => {
	const { registration, update } = useRegistration()

	return (
		<Collapsible
			title="Visa Invitation Letter"
			error={registration.needsInvitationLetter}
		>
			<div class="form-check">
				<input
					class="form-check-input"
					type="checkbox"
					id="needsInvitationLetter"
					checked={registration.needsInvitationLetter ?? false}
					onChange={(e) => {
						update('needsInvitationLetter', e.currentTarget.checked)
					}}
				/>
				<label class="form-check-label" for="needsInvitationLetter">
					Please check this box if you need an invitation letter for your visa
					application.
				</label>
			</div>
			<Show when={registration.needsInvitationLetter}>
				<p class="mt-3 mt-0">
					Unfortunately we cannot provide an invitation letter for your visa
					application. Please uncheck the box to acknowledge that you understand
					this.
				</p>
			</Show>
		</Collapsible>
	)
}
