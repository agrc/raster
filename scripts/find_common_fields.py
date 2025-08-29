import arcpy
from functools import reduce

extents = {
    "aerials": "https://services1.arcgis.com/99lidPhWCzftIe9K/arcgis/rest/services/Aerial_Photography_Extents/FeatureServer/0",
    "auto_dems": "https://services1.arcgis.com/99lidPhWCzftIe9K/arcgis/rest/services/AutoCorrelated_DEM_Extents/FeatureServer/0",
    "contours": "https://services1.arcgis.com/99lidPhWCzftIe9K/arcgis/rest/services/Contour_Line_Extents/FeatureServer/0",
    "topo": "https://services1.arcgis.com/99lidPhWCzftIe9K/arcgis/rest/services/DRG_Extents/FeatureServer/0",
    "lidar": "https://services1.arcgis.com/99lidPhWCzftIe9K/arcgis/rest/services/LiDAR_Extents/FeatureServer/0",
    "usgs": "https://services1.arcgis.com/99lidPhWCzftIe9K/arcgis/rest/services/USGS_DEM_Extents/FeatureServer/0",
}

tile_indexes = {
    "aerials": r"L:\agrc\raster\Raster_3.0\Raster.gdb\Aerial_Photography",
    "auto_dems": r"L:\agrc\raster\Raster_3.0\Raster.gdb\AutoCorrelated_DEMs",
    "contours": r"L:\agrc\raster\Raster_3.0\Raster.gdb\Contours",
    "topo": r"L:\agrc\raster\Raster_3.0\Raster.gdb\DRGs",
    "lidar": r"L:\agrc\raster\Raster_3.0\Raster.gdb\Lidar",
    "usgs": r"L:\agrc\raster\Raster_3.0\Raster.gdb\USGS_DEMs",
}

def get_feature_service_fields(service_url):
    """
    Get field information from an ArcGIS Feature Service using arcpy

    Args:
        service_url (str): The URL of the feature service

    Returns:
        list: List of field names from the service
    """
    try:
        # Use arcpy to describe the feature service
        desc = arcpy.Describe(service_url)

        # Get field names from the description
        fields = [field.name for field in desc.fields]

        return fields

    except Exception as e:
        print(f"Error accessing service {service_url}: {e}")
        return []

def find_common_fields(sources_dict):
    """
    Find common field names across all feature services

    Args:
        extents_dict (dict): Dictionary of service names and URLs

    Returns:
        set: Set of common field names
    """
    all_field_sets = []
    service_fields = {}

    print("Fetching field information from each service...\n")

    # Get fields from each service
    for service_name, service_url in sources_dict.items():
        print(f"Processing {service_name}...")
        fields = get_feature_service_fields(service_url)

        if fields:
            field_set = set(fields)
            all_field_sets.append(field_set)
            service_fields[service_name] = fields
            print(f"  Found {len(fields)} fields")
        else:
            print("  No fields found or error occurred")

        print()

    # Find common fields across all services
    if all_field_sets:
        common_fields = reduce(lambda x, y: x.intersection(y), all_field_sets)
    else:
        common_fields = set()

    return common_fields, service_fields

def main(data_dict, label):
    """Main function to find and display common fields"""
    print("=" * 60)
    print(f"\n\n{label} - Finding common field names between feature services...\n\n")
    print("=" * 60)

    common_fields, service_fields = find_common_fields(data_dict)

    print("=" * 60)
    print("\nRESULTS:")
    print("=" * 60)

    # Display fields for each service
    print("\nFields by service:")
    for service_name, fields in service_fields.items():
        print(f"\n{service_name.upper()}:")
        if fields:
            for field in sorted(fields):
                print(f"  - {field}")
        else:
            print("  - No fields retrieved")

    # Display common fields
    print("\nCOMMON FIELDS ACROSS ALL SERVICES:")
    print("-" * 40)
    if common_fields:
        print(f"Found {len(common_fields)} common fields:")
        for field in sorted(common_fields):
            print(f"  - {field}")
    else:
        print("No common fields found across all services.")

    # Analysis of non-common fields
    if service_fields:
        print("\nNON-COMMON FIELDS BY SERVICE:")
        print("-" * 40)

        # Find all unique fields across all services
        all_fields = set()
        for fields in service_fields.values():
            all_fields.update(fields)

        # Find non-common fields (fields not in the common set)
        non_common_fields = all_fields - common_fields

        if non_common_fields:
            print(f"Found {len(non_common_fields)} fields that are not common to all services:\n")

            # For each non-common field, show which services have it
            for field in sorted(non_common_fields):
                services_with_field = []
                for service_name, fields in service_fields.items():
                    if field in fields:
                        services_with_field.append(service_name)

                print(f"  {field}:")
                print(f"    Found in: {', '.join(services_with_field)}")
                print(f"    Missing from: {', '.join(set(service_fields.keys()) - set(services_with_field))}")
                print()
        else:
            print("All fields are common to all services.")

    # Additional analysis - find fields common to most services
    if service_fields:
        print("\nFIELD FREQUENCY ANALYSIS:")
        print("-" * 40)

        # Count how many services have each field
        field_counts = {}
        for fields in service_fields.values():
            for field in fields:
                field_counts[field] = field_counts.get(field, 0) + 1

        # Sort by frequency (most common first)
        sorted_fields = sorted(field_counts.items(), key=lambda x: x[1], reverse=True)

        total_services = len(service_fields)
        for field, count in sorted_fields:
            percentage = (count / total_services) * 100
            print(f"  {field}: {count}/{total_services} services ({percentage:.1f}%)")

if __name__ == "__main__":
    main(extents, "EXTENTS SERVICES")
    main(tile_indexes, "TILE INDEX SERVICES")
