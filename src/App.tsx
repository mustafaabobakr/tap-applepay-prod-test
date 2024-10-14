import { ApplePayButton, abortApplePaySession, ApplePayButtonProps } from "@tap-payments/apple-pay-button";

const items = [
	{
		label: "Pay for Later",
		amount: "1.99",
		paymentTiming: "immediate",
		type: "final",
		automaticReloadPayment: {
			thresholdAmount: "10.00",
		},
	},
	{
		label: "Pay for Later",
		amount: "1.99",
		paymentTiming: "deferred",
		type: "final",
		deferredPayment: {
			deferredPaymentDate: new Date("December 2, 2024 03:24:00"),
		},
	},
	{
		type: "final",
		label: "string",
		amount: "200",
		paymentTiming: "recurring",
		scheduledPayment: {
			recurringStartDate: new Date("December 2, 2024 03:24:00"),
			recurringEndDate: new Date("December 2, 2025 03:24:00"),
			recurringIntervalUnit: "year",
			recurringIntervalCount: 1,
		},
	},
] as ApplePayButtonProps["transaction"]["items"];

const newLineItems =
	items?.map((item) => ({
		type: item.type,
		label: item.label,
		amount: item.amount,
		paymentTiming: item.paymentTiming,
		recurringPaymentStartDate: item.scheduledPayment?.recurringStartDate,
		recurringPaymentIntervalUnit: item.scheduledPayment?.recurringIntervalUnit,
		recurringPaymentIntervalCount: item.scheduledPayment?.recurringIntervalCount,
		recurringPaymentEndDate: item.scheduledPayment?.recurringEndDate,
		deferredPaymentDate: item.deferredPayment?.deferredPaymentDate,
		automaticReloadPaymentThresholdAmount: item.automaticReloadPayment?.thresholdAmount,
	})) || [];

function App() {
	return (
		<main
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				transform: "scale(3)",
			}}>
			<ApplePayButton
				debug={true}
				scope='TapToken'
				publicKey='pk_test_Vlk842B1EA7tDN5QbrfGjYzh'
				environment='production'
				merchant={{
					domain: "demo.staging.tap.company",
					id: "1124340",
				}}
				acceptance={{
					supportedBrands: ["mada", "masterCard", "visa"],
				}}
				features={{
					supportsCouponCode: true,
					shippingContactFields: ["name", "phone", "email"],
				}}
				transaction={{
					currency: "KWD",
					amount: "20",
					couponCode: "tap-copoun",
					shipping: [
						{
							label: "DHL",
							detail: "Arrives in 5 to 7 days",
							amount: "1.00",
							identifier: "DHL",
						},
						{
							label: "Aramex",
							detail: "Arrives in 5 to 7 days",
							amount: "2.00",
							identifier: "Aramex",
						},
					],
					items,
				}}
				customer={{
					name: [
						{
							lang: "en",
							first: "test",
							last: "tester",
							middle: "test",
						},
					],
					contact: {
						email: "test@gmail.com",
						phone: {
							number: "1000000000",
							countryCode: "+20",
						},
					},
				}}
				interface={{
					locale: "en",
					theme: "dark",
					type: "buy",
					edges: "curved",
				}}
				onCancel={() => {
					console.log("onCancel");
				}}
				onError={(error) => {
					console.log("onError", error);
				}}
				onReady={() => {
					console.log("onReady");
				}}
				onSuccess={async (data, event) => {
					console.log("onSuccess", data);

					// event details regarding applepay event https://developer.apple.com/documentation/apple_pay_on_the_web/applepaypaymentauthorizedevent
					console.log("applepay event", event);
				}}
				onMerchantValidation={(status) => {
					console.log("onMerchantValidation", { status });
					if (status === "error") {
						// to close applepay sheet
						abortApplePaySession();
					}
				}}
				onPaymentMethodSelected={async (paymenMethod) => {
					console.log({ paymenMethod });
					return {
						// newTotal is required
						newTotal: {
							label: "Merchant Name",
							amount: "1.00",
						},
						// rest of options are optional and you can pass it regarding applepay documentation
						// https://developer.apple.com/documentation/apple_pay_on_the_web/applepaypaymentmethodupdate
						newLineItems,
					};
				}}
				onShippingMethodSelected={async (shippingMehod) => {
					console.log({ shippingMehod });
					return {
						// newTotal is required
						newTotal: {
							label: "Merchant Name",
							amount: "1.00",
						},
						// rest of options are optional and you can pass it regarding applepay documentation
						// https://developer.apple.com/documentation/apple_pay_on_the_web/applepayshippingmethodupdate
						newLineItems,
					};
				}}
				onShippingContactSelected={async (shippingContact) => {
					console.log({ shippingContact });
					return {
						// newTotal is required
						newTotal: {
							label: "Merchant Name",
							amount: "1.00",
						},
						// rest of options are optional and you can pass it regarding applepay documentation
						// https://developer.apple.com/documentation/apple_pay_on_the_web/applepayshippingmethodupdate
						newLineItems,
					};
				}}
				onCouponChanged={async (couponCode) => {
					console.log({ couponCode });
					// you can check couponCode value in async callback
					return {
						// newTotal is required
						newTotal: {
							label: "Merchant Name",
							amount: "1.00",
						},
						// rest of options are optional and you can pass it regarding applepay documentation
						// https://developer.apple.com/documentation/apple_pay_on_the_web/applepaycouponcodeupdate
						newLineItems,
					};
				}}
			/>
		</main>
	);
}

export default App;
