package com.example.demo.utils;

import java.text.NumberFormat;
import java.util.Currency;
import java.util.Locale;

public final class FormatUtils {

    private FormatUtils() {}

    public static String formatMoney(double amount, String currency) {
        NumberFormat fmt = NumberFormat.getCurrencyInstance(Locale.US);
        fmt.setCurrency(Currency.getInstance(currency));
        return fmt.format(amount);
    }

    public static String formatMoney(double amount) {
        return formatMoney(amount, "USD");
    }

    public static String pluralize(int n, String singular, String plural) {
        return n == 1 ? singular : plural;
    }

    public static String pluralize(int n, String singular) {
        return pluralize(n, singular, singular + "s");
    }
}
